use cinnamon::{ngspice::types::*, spice::manager::SpiceManager};
use colored::Colorize;
use std::{
    collections::VecDeque,
    sync::{Arc, Mutex, RwLock},
};
use tauri::Emitter;

use crate::simulator::{
    commands::SecondaryThreadStatus,
    simulation_status::{SimulationStatus, SimulationStatusPayload},
    simulator_error::SimulatorError,
};

use super::commands::SimulationThreadOrchestrator;

#[derive(Clone, Debug)]
pub struct NGGSpiceManager {
    // -------- Callbacks
    sharedres: Arc<RwLock<VecDeque<String>>>,
    quit_flag: bool,
    vec_char: Vec<String>,
    vec_stat: Vec<String>,
    vec_pkvecinfoall: Vec<PkVecinfoall>,
    vec_pkvecvalsall: Vec<PkVecvaluesall>,

    // -------- Internal
    app_handle: tauri::AppHandle,
    // used to orchestrate simulation
    id: usize,
    thread_orchestrator: Arc<Mutex<SimulationThreadOrchestrator>>,
}

impl NGGSpiceManager {
    pub fn new(
        id: usize,
        thread_orchestrator: Arc<Mutex<SimulationThreadOrchestrator>>,
        app_handle: tauri::AppHandle,
    ) -> Self {
        NGGSpiceManager {
            sharedres: Arc::new(RwLock::new(VecDeque::<String>::with_capacity(10))),
            quit_flag: false,
            vec_char: Vec::<String>::new(),
            vec_stat: Vec::<String>::new(),
            vec_pkvecinfoall: Vec::<PkVecinfoall>::new(),
            vec_pkvecvalsall: Vec::<PkVecvaluesall>::new(),
            app_handle,

            thread_orchestrator,
            id,
        }
    }
}

impl SpiceManager for NGGSpiceManager {
    fn cb_send_char(&mut self, msg: String, id: i32) {
        let mut arvs = self.sharedres.write().unwrap();
        (*arvs).push_back(msg.clone());

        let opt = msg.split_once(' ');
        let (token, msgs) = match opt {
            Some(tup) => (tup.0, tup.1),
            None => (msg.as_str(), msg.as_str()),
        };
        let msgc = match token {
            "stdout" => msgs.green(),
            "stderr" => msgs.red(),
            _ => msg.magenta().strikethrough(),
        };
        println!("{}", msgc);
    }
    fn cb_send_stat(&mut self, msg: String, id: i32) {
        // TODO: error handling

        println!("{}", msg.green());

        let orch_guard = self.thread_orchestrator.lock().unwrap();
        let maybe_id = orch_guard.get_thread_ongoing_simulation_id(id as usize);
        drop(orch_guard);

        match maybe_id {
            Some(id) => {
                match SimulationStatus::new(&msg) {
                    Ok(status) => {
                        if let Err(_) = self.app_handle.emit(
                            "simulation_status_update",
                            SimulationStatusPayload {
                                status,
                                id: id.to_owned(),
                            },
                        ) {
                            self.cb_ctrldexit(1, true, true, 1);
                        };
                    }

                    Err(_) => {
                        self.cb_ctrldexit(1, true, true, 1);
                    }
                };

                println!("{}", msg.blue());
            }
            None => {
                // TODO: Que hago aca?
            }
        }
    }
    fn cb_ctrldexit(&mut self, status: i32, is_immediate: bool, is_quit: bool, id: i32) {
        println!(
            "ctrldexit {}; {}; {}; {};",
            status, is_immediate, is_quit, id
        );
        self.quit_flag = true;
    }
    fn cb_send_init(&mut self, pkvecinfoall: PkVecinfoall, id: i32) {
        self.vec_pkvecinfoall.push(pkvecinfoall);
    }
    fn cb_send_data(&mut self, pkvecvaluesall: PkVecvaluesall, count: i32, id: i32) {
        // println!("{:?}", pkvecvaluesall);
        self.vec_pkvecvalsall.push(pkvecvaluesall);
    }
    fn cb_bgt_state(&mut self, is_fin: bool, id: i32) {
        println!(
            "BG thread for {} is {};",
            id,
            if is_fin { "done" } else { "starting" }
        );

        if is_fin {
            let mut orch_guard = self.thread_orchestrator.lock().unwrap();
            orch_guard.set_thread_status(id as usize, SecondaryThreadStatus::Idle);
            let maybe_id = orch_guard.get_thread_ongoing_simulation_id(id as usize);
            drop(orch_guard);

            if let Some(running_id) = maybe_id {
                // Over-emit the ready status on bg thread is done,
                // The .op simulation does not have events so this covers it

                if let Err(_) = self.app_handle.emit(
                    "simulation_status_update",
                    SimulationStatusPayload {
                        status: SimulationStatus::Ready,
                        id: running_id,
                    },
                ) {
                    self.cb_ctrldexit(1, true, true, 1);
                }
            };
        }
    }
}