use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use std::thread::sleep;
use std::time::Duration;
use std::{
    collections::{HashMap, HashSet},
    ffi::OsStr,
};

use super::paprika::spice::spice::Spice;
use colored::Colorize;

use super::commands::{SecondaryThreadStatus, SimulationThreadOrchestrator};
use super::simulation::Simulation;
use super::{
    circuit::{
        canvas::{CanvasEdge, CanvasNode, NodeData},
        element::{Element, SmallSignalConfig, TimeDomainConfig},
        schematic::Schematic,
    },
    manager::NGGSpiceManager,
    simulator_error::SimulatorError,
    unit_of_magnitude::UnitOfMagnitude,
};
use libloading::Library;

#[derive(Clone)]
pub struct Simulator {
    id: usize,
    spice: Spice<NGGSpiceManager>,
    schematic: Option<Schematic>,
    thread_orchestrator: Arc<Mutex<SimulationThreadOrchestrator>>,
}

impl Simulator {
    pub fn init(
        id: usize,
        thread_orchestrator: Arc<Mutex<SimulationThreadOrchestrator>>,
        lib: PathBuf,
        app_handle: tauri::AppHandle,
    ) -> (Simulator, Library) {
        let manager = NGGSpiceManager::new(id, Arc::clone(&thread_orchestrator), app_handle);
        log::info!("Manager created for thread {}", id);

        let (spice, library) = Spice::init(OsStr::new(lib.as_os_str()), manager, id as i32)
            // TODO: Better err handling
            .unwrap();

        log::info!("Spice created for thread {}", id);

        (
            Simulator {
                id,
                spice,
                schematic: None,
                thread_orchestrator,
            },
            library,
        )
    }

    pub fn run(&mut self) {
        log::info!("Being run on thread {}...", self.id);

        loop {
            let orch_guard = self.thread_orchestrator.lock().unwrap();
            let status = orch_guard.get_thread_status(self.id);
            drop(orch_guard);

            match status {
                SecondaryThreadStatus::Idle => {
                    let mut orch_guard = self.thread_orchestrator.lock().unwrap();
                    let maybe_simulation = orch_guard.dequeue_simulation(self.id);
                    drop(orch_guard);

                    if let Some((new_simulation_id, new_simulation_config)) = maybe_simulation {
                        let simulation = Simulation::from_config(new_simulation_config).unwrap();

                        let mut orch_guard = self.thread_orchestrator.lock().unwrap();

                        orch_guard.set_active_simulation(self.id, &new_simulation_id);
                        orch_guard.restart_timer(self.id);
                        log::info!("Thread {}: {:?}", self.id, SecondaryThreadStatus::Running);
                        orch_guard.set_thread_status(self.id, SecondaryThreadStatus::Running);

                        drop(orch_guard);

                        self.simulate(simulation);
                    } else {
                        let mut orch_guard = self.thread_orchestrator.lock().unwrap();
                        log::info!("Thread {}: {:?}", self.id, SecondaryThreadStatus::Done);
                        orch_guard.set_thread_status(self.id, SecondaryThreadStatus::Done);
                        drop(orch_guard);
                    }
                }

                SecondaryThreadStatus::Running => {
                    continue;
                }

                SecondaryThreadStatus::Halted => {
                    // TODO: implement
                }

                SecondaryThreadStatus::Panic => {
                    // TODO: implement
                }

                SecondaryThreadStatus::Done => {
                    break;
                }
            }

            sleep(Duration::from_millis(50));
        }
    }

    pub fn is_running(&self) -> bool {
        self.spice.is_running()
    }

    pub fn load_schematic(&mut self, schematic: Schematic) {
        self.schematic = Some(schematic);
    }

    pub fn create_schematic_from_canvas(
        nodes: Vec<CanvasNode>,
        edges: Vec<CanvasEdge>,
    ) -> Result<Schematic, SimulatorError> {
        let mut connections: HashMap<String, HashSet<(String, String)>> = HashMap::default();
        let mut schematic = Schematic::new();

        // Lets me know the node type by id
        let nodes_map: HashMap<String, CanvasNode> = nodes
            .clone()
            .into_iter()
            .map(|node| (node.id.to_owned(), node.clone()))
            .collect();

        // Get all connections, and create a map of all nodes connected to sources
        for edge in edges {
            let node_connections: &mut HashSet<(String, String)> =
                connections.entry(edge.source.to_owned()).or_default();

            let maybe_source_node = nodes_map.get(&edge.source);

            if let Some(source_node) = maybe_source_node {
                match source_node.data {
                    NodeData::Gnd { .. } => {
                        schematic.insert_ground_alias(&edge.target);
                    }

                    _ => {
                        node_connections.insert((edge.source_port, edge.target));
                    }
                };
            }
        }

        for node in nodes {
            let mut node_connections: Vec<(String, String)> = connections
                .entry(node.id)
                .or_default()
                .clone()
                .into_iter()
                .collect();

            // Ensure ports are tagged in the order they should be outputted, sort by source
            node_connections.sort_by(|c1, c2| c1.0.cmp(&c2.0));

            match node.data {
                NodeData::R {
                    value,
                    name,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::R(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            position,
                        ))
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::C {
                    value,
                    name,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::C(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            position,
                        ))
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::L {
                    value,
                    name,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::L(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            position,
                        ))
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::V {
                    name,
                    time_domain,
                    small_signal,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        if let Some(small_signal) = small_signal {
                            let transformed_small_signal_config =
                                SmallSignalConfig::from_canvas(small_signal)?;

                            schematic.insert(Element::V(
                                name,
                                TimeDomainConfig::from_canvas(time_domain)?,
                                Some(transformed_small_signal_config),
                                n1.1.to_owned(),
                                n2.1.to_owned(),
                                position,
                            ));
                        } else {
                            schematic.insert(Element::V(
                                name,
                                TimeDomainConfig::from_canvas(time_domain)?,
                                None,
                                n1.1.to_owned(),
                                n2.1.to_owned(),
                                position,
                            ));
                        }
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::I {
                    name,
                    time_domain,
                    small_signal,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        if let Some(small_signal) = small_signal {
                            let transformed_small_signal_config =
                                SmallSignalConfig::from_canvas(small_signal)?;

                            schematic.insert(Element::I(
                                name,
                                TimeDomainConfig::from_canvas(time_domain)?,
                                Some(transformed_small_signal_config),
                                n1.1.to_owned(),
                                n2.1.to_owned(),
                                position,
                            ));
                        } else {
                            schematic.insert(Element::I(
                                name,
                                TimeDomainConfig::from_canvas(time_domain)?,
                                None,
                                n1.1.to_owned(),
                                n2.1.to_owned(),
                                position,
                            ));
                        }
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::E {
                    name,
                    value,
                    position,
                } => {
                    if let Some([n1, n2, cn1, cn2]) = &node_connections.get(0..4) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::E(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            cn1.1.to_owned(),
                            cn2.1.to_owned(),
                            position,
                        ))
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::F {
                    name,
                    value,
                    src,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::F(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            src,
                            position,
                        ));
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::G {
                    name,
                    value,
                    position,
                } => {
                    if let Some([n1, n2, cn1, cn2]) = &node_connections.get(0..4) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::G(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            cn1.1.to_owned(),
                            cn2.1.to_owned(),
                            position,
                        ))
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::H {
                    name,
                    value,
                    src,
                    position,
                } => {
                    if let Some([n1, n2]) = &node_connections.get(0..2) {
                        let unit = UnitOfMagnitude::from(value)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        schematic.insert(Element::H(
                            name,
                            unit,
                            n1.1.to_owned(),
                            n2.1.to_owned(),
                            src,
                            position,
                        ));
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::Q {
                    name,
                    model,
                    position,
                } => {
                    if let Some([c_node, b_node, e_node]) = &node_connections.get(0..3) {
                        schematic.insert(Element::Q(
                            name,
                            c_node.1.to_owned(),
                            b_node.1.to_owned(),
                            e_node.1.to_owned(),
                            model.to_domain(),
                            position,
                        ));
                    } else {
                        return Err(SimulatorError::FloatingNode);
                    }
                }

                NodeData::Gnd { .. } => {}
                NodeData::Node { .. } => {}
            }
        }

        Ok(schematic)
    }

    pub fn simulate(&mut self, sim_config: Simulation) -> Result<(), SimulatorError> {
        let netlist = match &self.schematic {
            Some(schematic) => schematic.build_netlist(sim_config),
            None => return Err(SimulatorError::NoSchematicFound),
        }?;

        log::info!("{}", netlist.green());

        for line in netlist.lines() {
            self.spice.command(&format!("circbyline {}", line));
        }

        self.spice.command("bg_run");

        Ok(())
    }
}
