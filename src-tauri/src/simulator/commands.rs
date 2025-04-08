use std::{
    collections::HashMap,
    fs::File,
    path::PathBuf,
    sync::{Arc, Mutex},
    thread::{self, sleep},
    time::{Duration, Instant, SystemTime},
};
use tauri::{ipc::Channel, Manager, State};

use tauri_plugin_dialog::DialogExt;

use crate::{
    app_state::{instance::InstanceState, AppState},
    compat::{engine::Engine, spice::graphic_spice::engine::GraphicSpice},
};

use super::{
    circuit::canvas::{CanvasEdge, CanvasNode},
    sharedlib::get_shared_lib_path,
    simulation::SimulationConfig,
    simulation_data::{SimulationData, SimulationDataPayload},
    simulation_status::SimulationStatusPayload,
    simulator::Simulator,
    simulator_error::SimulatorError,
};

#[derive(Debug, Clone)]
enum MainThreadStatus {
    Running,
    Done,
}

#[derive(Debug, Clone)]
pub enum SecondaryThreadStatus {
    Idle,
    Running,
    Halted,
    Done,
    Panic,
}

const AVAIL_SPICE_THREADS: usize = 4;

#[derive(Debug, Clone)]
struct ThreadOperationInfo {
    status: SecondaryThreadStatus,
    ongoing_simulation: Option<String>,
    queued_simulations: Vec<(String, SimulationConfig)>,
    current_timer: Option<SystemTime>,
    simulation_data_buffer: Vec<SimulationData>,
}

impl ThreadOperationInfo {
    pub fn new() -> Self {
        Self {
            status: SecondaryThreadStatus::Idle,
            queued_simulations: Vec::default(),
            ongoing_simulation: None,
            current_timer: None,
            simulation_data_buffer: Vec::default(),
        }
    }

    pub fn restart_timer(&mut self) {
        self.current_timer = Some(SystemTime::now());
    }

    pub fn has_threshold_elapsed(&self, threshold: u128) -> bool {
        if let Some(timer) = &self.current_timer {
            if let Ok(elapsed) = timer.elapsed() {
                if elapsed.as_millis() > threshold {
                    log::info!("Elapsed {}", elapsed.as_millis())
                }

                return elapsed.as_millis() > threshold;
            }
        }

        return false;
    }

    pub fn flush_simulation_data_buffer(&mut self) -> Vec<SimulationData> {
        let buffer = self.simulation_data_buffer.clone();

        self.simulation_data_buffer = Vec::default();

        return buffer;
    }

    pub fn push_simulation_data(&mut self, simulation_data: SimulationData) {
        self.simulation_data_buffer.push(simulation_data);
    }

    pub fn queue_simulation(&mut self, simulation_info: (String, SimulationConfig)) {
        self.queued_simulations.push(simulation_info)
    }

    pub fn dequeue_simulation(&mut self) -> Option<(String, SimulationConfig)> {
        self.queued_simulations.pop()
    }

    pub fn set_status(&mut self, new_status: SecondaryThreadStatus) {
        self.status = new_status;
    }

    pub fn set_active_simulation(&mut self, sim_id: &str) {
        self.ongoing_simulation = Some(sim_id.to_owned());
    }

    pub fn get_ongoing_simulation_id(&self) -> Option<String> {
        self.ongoing_simulation.clone()
    }
}

#[derive(Debug, Clone)]
pub struct SimulationThreadOrchestrator {
    status: MainThreadStatus,
    thread_info: HashMap<usize, ThreadOperationInfo>,
}

impl SimulationThreadOrchestrator {
    pub fn new(simulations_to_run: HashMap<String, SimulationConfig>) -> Self {
        let mut allocated: usize = 0;

        let mut thread_info: HashMap<usize, ThreadOperationInfo> = HashMap::default();

        for (id, simulation) in simulations_to_run {
            let thread_n = allocated % AVAIL_SPICE_THREADS;

            let operation_info = thread_info
                .entry(thread_n)
                .or_insert(ThreadOperationInfo::new());

            operation_info.queue_simulation((id, simulation));

            allocated = allocated + 1;
        }

        Self {
            status: MainThreadStatus::Running,
            thread_info,
        }
    }

    pub fn has_running_threads(&self) -> bool {
        for (_, thread_info) in &self.thread_info {
            match thread_info.status {
                SecondaryThreadStatus::Running => {
                    return true;
                }

                SecondaryThreadStatus::Halted => {
                    return true;
                }

                SecondaryThreadStatus::Idle => return true,

                _ => {
                    continue;
                }
            }
        }

        return false;
    }

    pub fn get_thread_ongoing_simulation_id(&self, id: usize) -> Option<String> {
        if let Some(thread_info) = self.thread_info.get(&id) {
            return thread_info.get_ongoing_simulation_id();
        }

        return None;
    }

    pub fn restart_timer(&mut self, id: usize) {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            return thread_info.restart_timer();
        }
    }

    pub fn has_threshold_elapsed(&self, id: usize, threshold: u128) -> bool {
        if let Some(thread_info) = self.thread_info.get(&id) {
            return thread_info.has_threshold_elapsed(threshold);
        }

        return false;
    }

    pub fn push_simulation_data(&mut self, id: usize, simulation_data: SimulationData) {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            return thread_info.push_simulation_data(simulation_data);
        }
    }

    pub fn flush_simulation_data_buffer(&mut self, id: usize) -> Vec<SimulationData> {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            return thread_info.flush_simulation_data_buffer();
        }

        return Vec::default();
    }

    pub fn get_thread_status(&self, id: usize) -> SecondaryThreadStatus {
        self.thread_info.get(&id).unwrap().status.clone()
    }

    pub fn dequeue_simulation(&mut self, id: usize) -> Option<(String, SimulationConfig)> {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            return thread_info.dequeue_simulation();
        } else {
            return None::<(String, SimulationConfig)>;
        }
    }

    pub fn set_thread_status(&mut self, id: usize, new_status: SecondaryThreadStatus) {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            thread_info.set_status(new_status);
        }
    }

    pub fn set_active_simulation(&mut self, id: usize, sim_id: &str) {
        if let Some(thread_info) = self.thread_info.get_mut(&id) {
            thread_info.set_active_simulation(sim_id);
        }
    }

    pub fn threads_needed(&self) -> usize {
        let threads_configured = self.thread_info.len();

        return threads_configured;
    }
}

#[tauri::command]
pub async fn simulate(
    nodes: Vec<CanvasNode>,
    edges: Vec<CanvasEdge>,
    config: HashMap<String, SimulationConfig>,
    data_update_channel: Channel<SimulationDataPayload>,
    status_update_channel: Channel<SimulationStatusPayload>,
    app_handle: tauri::AppHandle,
) -> Result<(), SimulatorError> {
    let app_state: State<AppState, '_> = app_handle.state();

    let instance_state_guard = app_state.instance_state.lock().unwrap();
    let mut instance_state = (*instance_state_guard).clone();
    drop(instance_state_guard);

    match instance_state {
        // If it was not saved, ask for a file path and save the initial file
        InstanceState::NotSaved => {
            log::info!("Instance - NOT SAVED, initializing file picker");

            let file_dialog_builder = app_handle.dialog().file();

            let file_path = file_dialog_builder.blocking_save_file();

            if let Some(file_path) = file_path {
                let mut path = PathBuf::from(file_path.as_path().unwrap());
                path.set_extension("gsp");

                instance_state = InstanceState::Saved {
                    last_modified: Instant::now(),
                    path: path.clone(),
                };

                let mut instance_state_guard = app_state.instance_state.lock().unwrap();
                *instance_state_guard = instance_state;
                drop(instance_state_guard);

                let file = File::create(path).unwrap();

                GraphicSpice::domain_to_file(nodes.clone(), edges.clone(), config.clone(), file)
                    .unwrap();
            } else {
                return Err(SimulatorError::FailedToSaveGraphicSpiceFile);
            }
        }

        // If it was previously saved, just save it again every time it simulates
        InstanceState::FailedToSave { path, .. } => {
            log::info!("Instance - FROM FAILED SAVED, re-saves to file");

            instance_state = InstanceState::Saved {
                last_modified: Instant::now(),
                path: path.clone(),
            };

            let mut instance_state_guard = app_state.instance_state.lock().unwrap();
            *instance_state_guard = instance_state;
            drop(instance_state_guard);

            let file = File::create(path).unwrap();

            GraphicSpice::domain_to_file(nodes.clone(), edges.clone(), config.clone(), file)
                .unwrap();
        }
        InstanceState::Saved { path, .. } => {
            log::info!("Instance - SAVED, re-saves to file");

            instance_state = InstanceState::Saved {
                last_modified: Instant::now(),
                path: path.clone(),
            };

            let mut instance_state_guard = app_state.instance_state.lock().unwrap();
            *instance_state_guard = instance_state;
            drop(instance_state_guard);

            let file = File::create(path).unwrap();

            GraphicSpice::domain_to_file(nodes.clone(), edges.clone(), config.clone(), file)
                .unwrap();
        }
    }

    log::info!("Starts simulate command");
    let mut simulation_handles: Vec<thread::JoinHandle<()>> = Vec::default();

    let orchestrator = Arc::new(Mutex::new(SimulationThreadOrchestrator::new(config)));
    let orchestrator_guard = orchestrator.lock().unwrap();
    let threads_needed = orchestrator_guard.threads_needed();
    log::info!("Threads needed: {}", threads_needed);
    drop(orchestrator_guard);

    let schematic = Simulator::create_schematic_from_canvas(nodes, edges)?;

    log::info!("Begin thread creation...");

    for thread_n in 0..(threads_needed) {
        log::info!("Spawns {} thread...", thread_n);

        let t_orchestrator = Arc::clone(&orchestrator);
        let t_app_handle = app_handle.clone();
        let t_schematic = schematic.clone();
        let t_data_update_channel = data_update_channel.clone();
        let t_status_update_channel = status_update_channel.clone();

        let handle = thread::spawn(move || {
            let thread_id = thread_n;

            log::info!("Init {} thread...", thread_id);

            let path = get_shared_lib_path(&t_app_handle, thread_id);

            log::info!("Opening lib at: {:?}", path.as_os_str());

            // Library needs to live until its done being used
            let (mut simulator, library) = Simulator::init(
                thread_id,
                t_orchestrator,
                path,
                t_data_update_channel,
                t_status_update_channel,
            );

            simulator.load_schematic(t_schematic);

            simulator.run();

            library.close();
        });

        simulation_handles.push(handle);
    }

    loop {
        let orch_guard = orchestrator.lock().unwrap();
        let status = orch_guard.status.clone();
        drop(orch_guard);

        match status {
            MainThreadStatus::Running => {
                let mut orch_guard = orchestrator.lock().unwrap();
                let has_running_threads = orch_guard.has_running_threads();

                if has_running_threads {
                    continue;
                } else {
                    orch_guard.status = MainThreadStatus::Done;
                }

                drop(orch_guard);
            }

            MainThreadStatus::Done => {
                log::info!("Main simulation thread is done");
                break;
            }
        }

        sleep(Duration::from_millis(100));
    }

    for handle in simulation_handles {
        handle.join().unwrap();
    }

    log::info!("All threads joined");

    Ok(())
}
