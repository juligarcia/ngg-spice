use super::{
    simulator_error::SimulatorError, unit_of_magnitude::UnitOfMagnitude as Unit, units::Time,
};

#[derive(serde::Deserialize, Debug, Clone)]
pub enum SimulationConfig {
    Tran {
        tstep: String,
        tstop: String,
        tstart: Option<String>,
        tmax: Option<String>,
        uic: Option<bool>,
    },
    Op {},
}

pub enum Simulation {
    Tran {
        tstep: Unit<Time>,
        tstop: Unit<Time>,
        tstart: Option<Unit<Time>>,
        tmax: Option<Unit<Time>>,
        uic: Option<bool>,
    },
    Op,
}

impl Simulation {
    pub fn available_simulations() -> Vec<String> {
        vec!["tran".to_owned()]
    }

    pub fn format(&self) -> String {
        match self {
            Simulation::Op => format!(".op\n"),
            Simulation::Tran {
                tstep,
                tstop,
                tstart,
                tmax,
                uic,
            } => {
                // TODO: enganchar las otras variables
                let formatted = format!(".tran {} {}\n", tstep.format(), tstop.format());

                formatted
            }
        }
    }

    pub fn from_config(config: SimulationConfig) -> Result<Simulation, SimulatorError> {
        match config {
            SimulationConfig::Op {} => Ok(Simulation::Op),
            SimulationConfig::Tran {
                tstep,
                tstop,
                tstart,
                tmax,
                uic,
            } => {
                let tstep = Unit::<Time>::from(tstep)
                    .map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let tstop = Unit::<Time>::from(tstop)
                    .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                let maybe_tstart = match tstart {
                    Some(time) => {
                        let time_unit = Unit::<Time>::from(time)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                        Some(time_unit)
                    }

                    None => None,
                };

                let maybe_tmax = match tmax {
                    Some(time) => {
                        let time_unit = Unit::<Time>::from(time)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                        Some(time_unit)
                    }

                    None => None,
                };

                return Ok(Simulation::Tran {
                    tstep,
                    tstop,
                    tstart: maybe_tstart,
                    tmax: maybe_tmax,
                    uic,
                });
            }
        }
    }
}
