use super::{simulator_error::SimulatorError, unit_of_magnitude::UnitOfMagnitude as Unit};
use std::fmt::Display;

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum FrequencyVariation {
    Dec,
    Oct,
    Lin,
}

impl Display for FrequencyVariation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                FrequencyVariation::Dec => "dec",
                FrequencyVariation::Oct => "oct",
                FrequencyVariation::Lin => "lin",
            }
        )
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum TransferFunction {
    Vol,
    Cur,
}

impl Display for TransferFunction {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                TransferFunction::Vol => "vol",
                TransferFunction::Cur => "cur",
            }
        )
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum PoleZerAnalysis {
    Pol,
    Zer,
    Pz,
}

impl Display for PoleZerAnalysis {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                PoleZerAnalysis::Pol => "pol",
                PoleZerAnalysis::Zer => "zer",
                PoleZerAnalysis::Pz => "pz",
            }
        )
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum CurrentOrVoltage {
    V,
    I,
}

impl CurrentOrVoltage {
    pub fn format(&self, output: &str) -> String {
        match self {
            CurrentOrVoltage::I => format!("I({})", output),
            CurrentOrVoltage::V => format!("V({})", output),
        }
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum SensitivityAnalysisType {
    Ac,
    Dc,
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum SimulationConfig {
    Tran {
        tstep: String,
        tstop: String,
        tstart: Option<String>,
        tmax: Option<String>,
        uic: Option<bool>,
    },
    Op {},
    Ac {
        fstart: String,
        fstop: String,
        variation: FrequencyVariation,
        nx: i32,
    },
    Dc {
        srcnam: String,
        vstart: String,
        vstop: String,
        vincr: String,

        src2: Option<String>,
        start2: Option<String>,
        stop2: Option<String>,
        incr2: Option<String>,
    },
    Disto {
        fstart: String,
        fstop: String,
        variation: FrequencyVariation,
        nx: i32,
        f2overf1: Option<f32>,
    },
    Noise {
        output: String,
        // Defaults to GND
        oref: Option<String>,
        src: String,
        variation: FrequencyVariation,
        pts: i32,
        fstart: String,
        fstop: String,
        pts_per_summary: Option<i32>,
    },
    Pz {
        node1: String,
        node2: String,
        node3: String,
        node4: String,
        transfer_function: TransferFunction,
        analysis_type: PoleZerAnalysis,
    },
    Sens {
        output_type: CurrentOrVoltage,
        output: String,
        analysis_type: SensitivityAnalysisType,
        fstart: Option<String>,
        fstop: Option<String>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
    },
}

pub enum Simulation {
    Tran {
        tstep: Unit,
        tstop: Unit,
        tstart: Option<Unit>,
        tmax: Option<Unit>,
        uic: Option<bool>,
    },
    Op,
    Ac {
        fstart: Unit,
        fstop: Unit,
        variation: FrequencyVariation,
        nx: i32,
    },
    Dc {
        srcnam: String,
        vstart: Unit,
        vstop: Unit,
        vincr: Unit,

        src2: Option<String>,
        start2: Option<Unit>,
        stop2: Option<Unit>,
        incr2: Option<Unit>,
    },
    Disto {
        fstart: Unit,
        fstop: Unit,
        variation: FrequencyVariation,
        nx: i32,
        f2overf1: Option<f32>,
    },
    Noise {
        output: String,
        oref: Option<String>,
        src: String,
        variation: FrequencyVariation,
        pts: i32,
        fstart: Unit,
        fstop: Unit,
        pts_per_summary: Option<i32>,
    },
    Pz {
        node1: String,
        node2: String,
        node3: String,
        node4: String,
        transfer_function: TransferFunction,
        analysis_type: PoleZerAnalysis,
    },
    Sens {
        output_type: CurrentOrVoltage,
        output: String,
        analysis_type: SensitivityAnalysisType,
        fstart: Option<Unit>,
        fstop: Option<Unit>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
    },
}

impl Simulation {
    pub fn available_simulations() -> Vec<String> {
        vec![
            "tran".to_owned(),
            "op".to_owned(),
            "ac".to_owned(),
            "dc".to_owned(),
            "disto".to_owned(),
            "noise".to_owned(),
        ]
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
                let mut formatted = format!(".tran {} {}", tstep.format(), tstop.format());

                if let Some(tstart) = tstart {
                    formatted.push_str(&format!(" {}", tstart.format()));

                    if let Some(tmax) = tmax {
                        formatted.push_str(&format!(" {}", tmax.format()));
                    }
                }

                if let Some(true) = uic {
                    formatted.push_str(" uic");
                }

                formatted.push('\n');

                formatted
            }

            Simulation::Dc {
                srcnam,
                vstart,
                vstop,
                vincr,
                src2,
                start2,
                stop2,
                incr2,
            } => {
                let mut formatted = format!(
                    ".dc {} {} {} {}",
                    srcnam,
                    vstart.format(),
                    vstop.format(),
                    vincr.format()
                );

                if let Some(src2) = src2 {
                    if let (Some(start2), Some(stop2), Some(incr2)) = (start2, stop2, incr2) {
                        formatted.push_str(&format!(
                            "{} {} {} {}",
                            src2,
                            start2.format(),
                            stop2.format(),
                            incr2.format()
                        ));
                    }
                }

                formatted.push('\n');

                return formatted;
            }

            Simulation::Ac {
                fstart,
                fstop,
                variation,
                nx,
            } => format!(
                ".ac {} {} {} {}\n",
                variation,
                nx,
                fstart.format(),
                fstop.format()
            ),

            Simulation::Noise {
                output,
                oref,
                src,
                variation,
                pts,
                fstart,
                fstop,
                pts_per_summary,
            } => {
                let mut formatted = String::default();

                let formatted_output = if let Some(oref) = oref {
                    format!("v({},{})", output, oref)
                } else {
                    format!("v({})", output)
                };

                formatted.push_str(&formatted_output);
                formatted.push_str(&format!(
                    " {} {} {} {} {}",
                    src,
                    variation,
                    pts,
                    fstart.format(),
                    fstop.format()
                ));

                if let Some(pts_per_summary) = pts_per_summary {
                    formatted.push_str(&format!(" {}", pts_per_summary));
                }

                formatted.push('\n');

                return formatted;
            }

            Simulation::Disto {
                fstart,
                fstop,
                variation,
                nx,
                f2overf1,
            } => {
                let mut formatted = format!(
                    ".disto {} {} {} {}",
                    variation,
                    nx,
                    fstart.format(),
                    fstop.format()
                );

                if let Some(f2overf1) = f2overf1 {
                    formatted.push_str(&format!(" {}", f2overf1));
                }

                formatted.push('\n');

                return formatted;
            }

            Simulation::Pz {
                node1,
                node2,
                node3,
                node4,
                transfer_function,
                analysis_type,
            } => format!(
                ".pz {} {} {} {} {} {}\n",
                node1, node2, node3, node4, transfer_function, analysis_type
            ),

            Simulation::Sens {
                output_type,
                output,
                analysis_type,
                fstart,
                fstop,
                variation,
                nx,
            } => match analysis_type {
                SensitivityAnalysisType::Dc => format!(".sens {}\n", output_type.format(output)),
                SensitivityAnalysisType::Ac => {
                    let mut formatted = format!(".sens {}", output_type.format(output));

                    if let (Some(variation), Some(nx), Some(fstart), Some(fstop)) =
                        (variation, nx, fstart, fstop)
                    {
                        formatted.push_str(&format!(
                            " {} {} {} {}\n",
                            variation,
                            nx,
                            fstart.format(),
                            fstop.format()
                        ));
                    } else {
                        formatted.push('\n');
                    }

                    formatted
                }
            },
        }
    }

    pub fn from_config(config: SimulationConfig) -> Result<Simulation, SimulatorError> {
        match config {
            SimulationConfig::Op {} => Ok(Simulation::Op),

            SimulationConfig::Ac {
                fstart,
                fstop,
                variation,
                nx,
            } => {
                let fstart =
                    Unit::from(fstart).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let fstop =
                    Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                return Ok(Simulation::Ac {
                    fstart,
                    fstop,
                    variation,
                    nx,
                });
            }

            SimulationConfig::Disto {
                fstart,
                fstop,
                variation,
                nx,
                f2overf1,
            } => {
                let fstart =
                    Unit::from(fstart).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let fstop =
                    Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                if let Some(f2overf1) = f2overf1 {
                    if f2overf1 >= 1.0 || f2overf1 <= 0.0 {
                        return Err(SimulatorError::MalformedSimulationConfig);
                    }
                }

                return Ok(Simulation::Disto {
                    fstart,
                    fstop,
                    variation,
                    nx,
                    f2overf1,
                });
            }

            SimulationConfig::Noise {
                output,
                oref,
                src,
                variation,
                pts,
                fstart,
                fstop,
                pts_per_summary,
            } => {
                let fstart =
                    Unit::from(fstart).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let fstop =
                    Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                return Ok(Simulation::Noise {
                    output,
                    oref,
                    src,
                    variation,
                    pts,
                    fstart,
                    fstop,
                    pts_per_summary,
                });
            }

            SimulationConfig::Tran {
                tstep,
                tstop,
                tstart,
                tmax,
                uic,
            } => {
                let tstep =
                    Unit::from(tstep).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let tstop =
                    Unit::from(tstop).map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                let maybe_tstart = match tstart {
                    Some(time) => {
                        let time_unit = Unit::from(time)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                        Some(time_unit)
                    }

                    None => None,
                };

                let maybe_tmax = match tmax {
                    Some(time) => {
                        let time_unit = Unit::from(time)
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

            SimulationConfig::Dc {
                srcnam,
                vstart,
                vstop,
                vincr,
                src2,
                start2,
                stop2,
                incr2,
            } => {
                let vstart =
                    Unit::from(vstart).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let vstop =
                    Unit::from(vstop).map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                let vincr =
                    Unit::from(vincr).map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                if let Some(src2) = src2 {
                    if let (Some(start2), Some(stop2), Some(incr2)) = (start2, stop2, incr2) {
                        let start2 = Unit::from(start2)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                        let stop2 = Unit::from(stop2)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                        let incr2 = Unit::from(incr2)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                        return Ok(Simulation::Dc {
                            srcnam,
                            vstart,
                            vstop,
                            vincr,
                            src2: Some(src2),
                            start2: Some(start2),
                            stop2: Some(stop2),
                            incr2: Some(incr2),
                        });
                    } else {
                        return Err(SimulatorError::MalformedSimulationConfig);
                    }
                }

                return Ok(Simulation::Dc {
                    srcnam,
                    vstart,
                    vstop,
                    vincr,
                    src2: None,
                    start2: None,
                    stop2: None,
                    incr2: None,
                });
            }

            SimulationConfig::Pz {
                node1,
                node2,
                node3,
                node4,
                transfer_function,
                analysis_type,
            } => Ok(Simulation::Pz {
                node1,
                node2,
                node3,
                node4,
                transfer_function,
                analysis_type,
            }),

            SimulationConfig::Sens {
                output_type,
                output,
                analysis_type,
                fstart,
                fstop,
                variation,
                nx,
            } => match analysis_type {
                SensitivityAnalysisType::Dc => Ok(Simulation::Sens {
                    output_type,
                    output,
                    analysis_type,
                    fstart: None,
                    fstop: None,
                    variation: None,
                    nx: None,
                }),

                SensitivityAnalysisType::Ac => {
                    if let (Some(fstart), Some(fstop), Some(variation), Some(nx)) =
                        (fstart, fstop, variation, nx)
                    {
                        let fstart = Unit::from(fstart)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;
                        let fstop = Unit::from(fstop)
                            .map_err(|_| SimulatorError::MalformedSimulationConfig)?;

                        Ok(Simulation::Sens {
                            output_type,
                            output,
                            analysis_type,
                            fstart: Some(fstart),
                            fstop: Some(fstop),
                            variation: Some(variation),
                            nx: Some(nx),
                        })
                    } else {
                        Err(SimulatorError::MalformedSimulationConfig)
                    }
                }
            },
        }
    }
}
