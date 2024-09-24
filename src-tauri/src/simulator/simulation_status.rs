use tauri::{Manager, Window};

use super::simulation::Simulation;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
pub struct SimulationStatusPayload {
    pub status: SimulationStatus,
    pub id: String,
}

#[derive(Debug)]
pub enum SimulationStatusError {
    UnkownStatus,
    MalformedSimulationStatus,
}

#[derive(Debug, serde::Serialize, Clone)]
pub enum SimulationStatus {
    SourceDeck,
    Progress {
        simulation_name: String,
        progress: f32,
    },
    Ready,
}

fn contains_any(haystack: &str, needles: Vec<String>) -> Option<String> {
    needles.into_iter().find(|needle| haystack.contains(needle))
}

impl SimulationStatus {
    pub fn new(status: &str) -> Result<SimulationStatus, SimulationStatusError> {
        match status {
            "Source Deck" => Ok(SimulationStatus::SourceDeck),
            "--ready--" => Ok(SimulationStatus::Ready),
            maybe_simulation_prorgess => {
                let maybe_simulation_name = contains_any(
                    maybe_simulation_prorgess,
                    Simulation::available_simulations(),
                );

                match maybe_simulation_name {
                    Some(simulation_name) => {
                        let progress: f32 = maybe_simulation_prorgess
                            .replace(&format!("{}: ", simulation_name), "")
                            .replace("%", "")
                            .parse()
                            .map_err(|_| SimulationStatusError::MalformedSimulationStatus)?;

                        Ok(SimulationStatus::Progress {
                            simulation_name: simulation_name.to_string(),
                            progress,
                        })
                    }

                    _ => Err(SimulationStatusError::UnkownStatus),
                }
            }
        }
    }
}
