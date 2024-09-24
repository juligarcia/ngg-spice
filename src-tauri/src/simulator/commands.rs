use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
    thread::{self, sleep},
    time::Duration,
};

use super::{
    circuit::canvas::{CanvasEdge, CanvasNode},
    simulation::{Simulation, SimulationConfig},
    simulator::Simulator,
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
}

impl ThreadOperationInfo {
    pub fn new() -> Self {
        Self {
            status: SecondaryThreadStatus::Idle,
            queued_simulations: Vec::default(),
            ongoing_simulation: None,
        }
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

        if threads_configured > 0 {
            return threads_configured - 1;
        } else {
            return 0;
        }
    }
}

#[tauri::command]
pub async fn simulate(
    nodes: Vec<CanvasNode>,
    edges: Vec<CanvasEdge>,
    config: HashMap<String, SimulationConfig>,
    app_handle: tauri::AppHandle,
) {
    println!("Starts simulate command");
    let mut simulation_handles: Vec<thread::JoinHandle<()>> = Vec::default();

    let orchestrator = Arc::new(Mutex::new(SimulationThreadOrchestrator::new(config)));
    let orchestrator_guard = orchestrator.lock().unwrap();
    let threads_needed = orchestrator_guard.threads_needed();
    drop(orchestrator_guard);

    let schematic = Simulator::create_schematic_from_canvas(nodes, edges).unwrap();

    println!("Begin thread creation...");

    for thread_n in 0..(threads_needed + 1) {
        println!("Spawns {} thread...", thread_n);

        let t_orchestrator = Arc::clone(&orchestrator);
        let t_app_handle = app_handle.clone();
        let t_schematic = schematic.clone();

        let handle = thread::spawn(move || {
            let thread_id = thread_n;

            println!("Init {} thread...", thread_id);

            let (mut simulator, _library) = Simulator::init(
                thread_id,
                t_orchestrator,
                format!(
                    "/opt/homebrew/opt/libngspice/lib/libngspice.{}.dylib",
                    thread_id
                )
                .as_str(),
                t_app_handle,
            );

            simulator.load_schematic(t_schematic);

            simulator.run();
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
                println!("Main simulation thread is done");
                break;
            }
        }

        sleep(Duration::from_millis(100));
    }

    for handle in simulation_handles {
        handle.join().unwrap();
    }

    println!("All threads joined");
}
