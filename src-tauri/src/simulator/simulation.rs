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

impl Display for CurrentOrVoltage {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                CurrentOrVoltage::I => "I",
                CurrentOrVoltage::V => "V",
            }
        )
    }
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

impl Display for SensitivityAnalysisType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{}",
            match self {
                SensitivityAnalysisType::Ac => "AC",
                SensitivityAnalysisType::Dc => "DC",
            }
        )
    }
}

#[derive(serde::Deserialize, serde::Serialize, Debug, Clone)]
pub enum SimulationConfig {
    Tran {
        tstep: Option<String>,
        tstop: Option<String>,
        tstart: Option<String>,
        tmax: Option<String>,
        uic: Option<bool>,
    },
    Op {},
    Ac {
        fstart: Option<String>,
        fstop: Option<String>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
    },
    Dc {
        srcnam: Option<String>,
        vstart: Option<String>,
        vstop: Option<String>,
        vincr: Option<String>,

        src2: Option<String>,
        start2: Option<String>,
        stop2: Option<String>,
        incr2: Option<String>,
    },
    Disto {
        fstart: Option<String>,
        fstop: Option<String>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
        f2overf1: Option<f32>,
    },
    Noise {
        output: Option<String>,
        // Defaults to GND
        oref: Option<String>,
        src: Option<String>,
        variation: Option<FrequencyVariation>,
        pts: Option<i32>,
        fstart: Option<String>,
        fstop: Option<String>,
        pts_per_summary: Option<i32>,
    },
    Pz {
        node1: Option<String>,
        node2: Option<String>,
        node3: Option<String>,
        node4: Option<String>,
        transfer_function: Option<TransferFunction>,
        analysis_type: Option<PoleZerAnalysis>,
    },
    Sens {
        output_type: Option<CurrentOrVoltage>,
        output: Option<String>,
        analysis_type: Option<SensitivityAnalysisType>,
        fstart: Option<String>,
        fstop: Option<String>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
    },
}

impl SimulationConfig {
    pub fn values_to_string(&self) -> String {
        match self {
            SimulationConfig::Tran {
                tstep,
                tstop,
                tstart,
                tmax,
                uic,
            } => {
                let mut formatted = format!("TRAN");

                if let Some(tstep) = tstep {
                    formatted.push_str(&format!(" {}", tstep));

                    if let Some(tstop) = tstop {
                        formatted.push_str(&format!(" {}", tstop));

                        if let Some(tstart) = tstart {
                            formatted.push_str(&format!(" {}", tstart));

                            if let Some(tmax) = tmax {
                                formatted.push_str(&format!(" {}", tmax));

                                if let Some(true) = uic {
                                    formatted.push_str(" uic");
                                }
                            }
                        }
                    }
                }

                formatted
            }

            SimulationConfig::Op {} => "OP".to_owned(),

            SimulationConfig::Ac {
                fstart,
                fstop,
                variation,
                nx,
            } => {
                let mut formatted = format!("AC");

                if let Some(fstart) = fstart {
                    formatted.push_str(&format!(" {}", fstart));

                    if let Some(fstop) = fstop {
                        formatted.push_str(&format!(" {}", fstop));

                        if let Some(variation) = variation {
                            formatted.push_str(&format!(" {}", variation));

                            if let Some(nx) = nx {
                                formatted.push_str(&format!(" {}", nx));
                            }
                        }
                    }
                }

                formatted
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
                let mut formatted = format!("DC");

                if let Some(srcnam) = srcnam {
                    formatted.push_str(&format!(" {}", srcnam));

                    if let Some(vstart) = vstart {
                        formatted.push_str(&format!(" {}", vstart));

                        if let Some(vstop) = vstop {
                            formatted.push_str(&format!(" {}", vstop));

                            if let Some(vincr) = vincr {
                                formatted.push_str(&format!(" {}", vincr));

                                if let Some(src2) = src2 {
                                    formatted.push_str(&format!(" {}", src2));

                                    if let Some(start2) = start2 {
                                        formatted.push_str(&format!(" {}", start2));

                                        if let Some(stop2) = stop2 {
                                            formatted.push_str(&format!(" {}", stop2));

                                            if let Some(incr2) = incr2 {
                                                formatted.push_str(&format!(" {}", incr2));
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }

            SimulationConfig::Disto {
                fstart,
                fstop,
                variation,
                nx,
                f2overf1,
            } => {
                let mut formatted = format!("DISTO");

                if let Some(fstart) = fstart {
                    formatted.push_str(&format!(" {}", fstart));

                    if let Some(fstop) = fstop {
                        formatted.push_str(&format!(" {}", fstop));

                        if let Some(variation) = variation {
                            formatted.push_str(&format!(" {}", variation));

                            if let Some(nx) = nx {
                                formatted.push_str(&format!(" {}", nx));

                                if let Some(f2overf1) = f2overf1 {
                                    formatted.push_str(&format!(" {}", f2overf1));
                                }
                            }
                        }
                    }
                }

                formatted
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
                let mut formatted = format!("NOISE");

                if let Some(output) = output {
                    formatted.push_str(&format!(" {}", output));

                    if let Some(src) = src {
                        formatted.push_str(&format!(" {}", src));

                        if let Some(variation) = variation {
                            formatted.push_str(&format!(" {}", variation));

                            if let Some(pts) = pts {
                                formatted.push_str(&format!(" {}", pts));

                                if let Some(fstart) = fstart {
                                    formatted.push_str(&format!(" {}", fstart));

                                    if let Some(fstop) = fstop {
                                        formatted.push_str(&format!(" {}", fstop));

                                        if let Some(pts_per_summary) = pts_per_summary {
                                            formatted.push_str(&format!(" {}", pts_per_summary));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }

            SimulationConfig::Pz {
                node1,
                node2,
                node3,
                node4,
                transfer_function,
                analysis_type,
            } => {
                let mut formatted = format!("PZ");

                if let Some(node1) = node1 {
                    formatted.push_str(&format!(" {}", node1));

                    if let Some(node2) = node2 {
                        formatted.push_str(&format!(" {}", node2));

                        if let Some(node3) = node3 {
                            formatted.push_str(&format!(" {}", node3));

                            if let Some(node4) = node4 {
                                formatted.push_str(&format!(" {}", node4));

                                if let Some(transfer_function) = transfer_function {
                                    formatted.push_str(&format!(" {}", transfer_function));

                                    if let Some(analysis_type) = analysis_type {
                                        formatted.push_str(&format!(" {}", analysis_type));
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }

            SimulationConfig::Sens {
                output_type,
                output,
                analysis_type,
                fstart,
                fstop,
                variation,
                nx,
            } => {
                let mut formatted = format!("SENS");

                if let Some(output_type) = output_type {
                    formatted.push_str(&format!(" {}", output_type));

                    if let Some(output) = output {
                        formatted.push_str(&format!(" {}", output));

                        if let Some(analysis_type) = analysis_type {
                            formatted.push_str(&format!(" {}", analysis_type));

                            if let Some(fstart) = fstart {
                                formatted.push_str(&format!(" {}", fstart));

                                if let Some(fstop) = fstop {
                                    formatted.push_str(&format!(" {}", fstop));

                                    if let Some(variation) = variation {
                                        formatted.push_str(&format!(" {}", variation));

                                        if let Some(nx) = nx {
                                            formatted.push_str(&format!(" {}", nx));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }
        }
    }

    pub fn get_kind(&self) -> String {
        match self {
            SimulationConfig::Tran { .. } => "TRAN".to_owned(),
            SimulationConfig::Op { .. } => "OP".to_owned(),
            SimulationConfig::Ac { .. } => "AC".to_owned(),
            SimulationConfig::Dc { .. } => "DC".to_owned(),
            SimulationConfig::Disto { .. } => "DISTO".to_owned(),
            SimulationConfig::Noise { .. } => "NOISE".to_owned(),
            SimulationConfig::Pz { .. } => "PZ".to_owned(),
            SimulationConfig::Sens { .. } => "SENS".to_owned(),
        }
    }

    pub fn from_tuple(kind_and_config: (&str, &str)) -> Result<SimulationConfig, SimulatorError> {
        let (kind, config) = kind_and_config;

        match kind {
            "TRAN" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Tran {
                    tstep: params.next().map(|tstep| tstep.to_owned()),
                    tstop: params.next().map(|tstop| tstop.to_owned()),
                    tstart: params.next().map(|tstart| tstart.to_owned()),
                    tmax: params.next().map(|tmax| tmax.to_owned()),
                    uic: params.next().map(|uic| uic == "uic"),
                });
            }
            "OP" => {
                return Ok(SimulationConfig::Op {});
            }
            "AC" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Ac {
                    fstart: params.next().map(|fstart| fstart.to_owned()),
                    fstop: params.next().map(|fstop| fstop.to_owned()),
                    variation: params
                        .next()
                        .map(|variation| match variation {
                            "dec" => Ok(FrequencyVariation::Dec),
                            "oct" => Ok(FrequencyVariation::Oct),
                            "lin" => Ok(FrequencyVariation::Lin),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    nx: params.next().map(|nx| nx.parse().unwrap()),
                });
            }
            "DC" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Dc {
                    srcnam: params.next().map(|srcnam| srcnam.to_owned()),
                    vstart: params.next().map(|vstart| vstart.to_owned()),
                    vstop: params.next().map(|vstop| vstop.to_owned()),
                    vincr: params.next().map(|vincr| vincr.to_owned()),

                    src2: params.next().map(|src2| src2.to_owned()),
                    start2: params.next().map(|start2| start2.to_owned()),
                    stop2: params.next().map(|stop2| stop2.to_owned()),
                    incr2: params.next().map(|incr2| incr2.to_owned()),
                });
            }
            "DISTO" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Disto {
                    fstart: params.next().map(|fstart| fstart.to_owned()),
                    fstop: params.next().map(|fstop| fstop.to_owned()),
                    variation: params
                        .next()
                        .map(|variation| match variation {
                            "dec" => Ok(FrequencyVariation::Dec),
                            "oct" => Ok(FrequencyVariation::Oct),
                            "lin" => Ok(FrequencyVariation::Lin),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    nx: params
                        .next()
                        .map(|nx| nx.parse::<i32>())
                        .transpose()
                        .map_err(|_| SimulatorError::MalformedSimulationConfig)?,
                    f2overf1: params.next().map(|f2overf1| f2overf1.parse().unwrap()),
                });
            }
            "NOISE" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Noise {
                    output: params.next().map(|output| output.to_owned()),
                    oref: params.next().map(|oref| oref.to_owned()),
                    src: params.next().map(|src| src.to_owned()),
                    variation: params
                        .next()
                        .map(|variation| match variation {
                            "dec" => Ok(FrequencyVariation::Dec),
                            "oct" => Ok(FrequencyVariation::Oct),
                            "lin" => Ok(FrequencyVariation::Lin),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    pts: params
                        .next()
                        .map(|pts| pts.parse::<i32>())
                        .transpose()
                        .map_err(|_| SimulatorError::MalformedSimulationConfig)?,
                    fstart: params.next().map(|fstart| fstart.to_owned()),
                    fstop: params.next().map(|fstop| fstop.to_owned()),
                    pts_per_summary: params
                        .next()
                        .map(|pts_per_summary| pts_per_summary.parse::<i32>())
                        .transpose()
                        .map_err(|_| SimulatorError::MalformedSimulationConfig)?,
                });
            }
            "PZ" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Pz {
                    node1: params.next().map(|node1| node1.to_owned()),
                    node2: params.next().map(|node2| node2.to_owned()),
                    node3: params.next().map(|node3| node3.to_owned()),
                    node4: params.next().map(|node4| node4.to_owned()),
                    transfer_function: params
                        .next()
                        .map(|transfer_function| match transfer_function {
                            "vol" => Ok(TransferFunction::Vol),
                            "cur" => Ok(TransferFunction::Cur),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    analysis_type: params
                        .next()
                        .map(|analysis_type| match analysis_type {
                            "pol" => Ok(PoleZerAnalysis::Pol),
                            "zer" => Ok(PoleZerAnalysis::Zer),
                            "pz" => Ok(PoleZerAnalysis::Pz),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                });
            }
            "SENS" => {
                let mut params = config.split(" ");

                return Ok(SimulationConfig::Sens {
                    output_type: params
                        .next()
                        .map(|output_type| match output_type {
                            "V" => Ok(CurrentOrVoltage::V),
                            "I" => Ok(CurrentOrVoltage::I),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    output: params.next().map(|output| output.to_owned()),
                    analysis_type: params
                        .next()
                        .map(|analysis_type| match analysis_type {
                            "ac" => Ok(SensitivityAnalysisType::Ac),
                            "dc" => Ok(SensitivityAnalysisType::Dc),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    fstart: params.next().map(|fstart| fstart.to_owned()),
                    fstop: params.next().map(|fstop| fstop.to_owned()),
                    variation: params
                        .next()
                        .map(|variation| match variation {
                            "dec" => Ok(FrequencyVariation::Dec),
                            "oct" => Ok(FrequencyVariation::Oct),
                            "lin" => Ok(FrequencyVariation::Lin),
                            _ => return Err(SimulatorError::MalformedSimulationConfig),
                        })
                        .transpose()?,
                    nx: params
                        .next()
                        .map(|nx| nx.parse::<i32>())
                        .transpose()
                        .map_err(|_| SimulatorError::MalformedSimulationConfig)?,
                });
            }
            _ => return Err(SimulatorError::MalformedSimulationConfig),
        }
    }
}

pub enum Simulation {
    Tran {
        tstep: Option<Unit>,
        tstop: Option<Unit>,
        tstart: Option<Unit>,
        tmax: Option<Unit>,
        uic: Option<bool>,
    },
    Op,
    Ac {
        fstart: Option<Unit>,
        fstop: Option<Unit>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
    },
    Dc {
        srcnam: Option<String>,
        vstart: Option<Unit>,
        vstop: Option<Unit>,
        vincr: Option<Unit>,

        src2: Option<String>,
        start2: Option<Unit>,
        stop2: Option<Unit>,
        incr2: Option<Unit>,
    },
    Disto {
        fstart: Option<Unit>,
        fstop: Option<Unit>,
        variation: Option<FrequencyVariation>,
        nx: Option<i32>,
        f2overf1: Option<f32>,
    },
    Noise {
        output: Option<String>,
        oref: Option<String>,
        src: Option<String>,
        variation: Option<FrequencyVariation>,
        pts: Option<i32>,
        fstart: Option<Unit>,
        fstop: Option<Unit>,
        pts_per_summary: Option<i32>,
    },
    Pz {
        node1: Option<String>,
        node2: Option<String>,
        node3: Option<String>,
        node4: Option<String>,
        transfer_function: Option<TransferFunction>,
        analysis_type: Option<PoleZerAnalysis>,
    },
    Sens {
        output_type: Option<CurrentOrVoltage>,
        output: Option<String>,
        analysis_type: Option<SensitivityAnalysisType>,
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
                let mut formatted = format!(".tran");

                if let Some(tstep) = tstep {
                    formatted.push_str(&format!(" {}", tstep.format()));

                    if let Some(tstop) = tstop {
                        formatted.push_str(&format!(" {}", tstop.format()));

                        if let Some(tstart) = tstart {
                            formatted.push_str(&format!(" {}", tstart.format()));

                            if let Some(tmax) = tmax {
                                formatted.push_str(&format!(" {}", tmax.format()));

                                if let Some(true) = uic {
                                    formatted.push_str(" uic");
                                }
                            }
                        }
                    }
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
                let mut formatted = format!(".dc",);

                if let Some(srcnam) = srcnam {
                    formatted.push_str(&format!(" {}", srcnam));

                    if let Some(vstart) = vstart {
                        formatted.push_str(&format!(" {}", vstart.format()));

                        if let Some(vstop) = vstop {
                            formatted.push_str(&format!(" {}", vstop.format()));

                            if let Some(vincr) = vincr {
                                formatted.push_str(&format!(" {}", vincr.format()));

                                if let Some(src2) = src2 {
                                    formatted.push_str(&format!(" {}", src2));

                                    if let Some(start2) = start2 {
                                        formatted.push_str(&format!(" {}", start2.format()));

                                        if let Some(stop2) = stop2 {
                                            formatted.push_str(&format!(" {}", stop2.format()));

                                            if let Some(incr2) = incr2 {
                                                formatted.push_str(&format!(" {}", incr2.format()));
                                            }
                                        }
                                    }
                                }
                            }
                        }
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
            } => {
                let mut formatted = format!(".ac");

                if let Some(variation) = variation {
                    formatted.push_str(&format!(" {}", variation));

                    if let Some(nx) = nx {
                        formatted.push_str(&format!(" {}", nx));

                        if let Some(fstart) = fstart {
                            formatted.push_str(&format!(" {}", fstart.format()));

                            if let Some(fstop) = fstop {
                                formatted.push_str(&format!(" {}", fstop.format()));
                            }
                        }
                    }
                }

                formatted.push_str("\n");

                formatted
            }

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
                let mut formatted = format!(".noise");

                if let Some(output) = output {
                    let formatted_output = if let Some(oref) = oref {
                        format!(" v({},{})", output, oref)
                    } else {
                        format!(" v({})", output)
                    };

                    formatted.push_str(&formatted_output);

                    if let Some(src) = src {
                        formatted.push_str(&format!(" {}", src));

                        if let Some(variation) = variation {
                            formatted.push_str(&format!(" {}", variation));

                            if let Some(pts) = pts {
                                formatted.push_str(&format!(" {}", pts));

                                if let Some(fstart) = fstart {
                                    formatted.push_str(&format!(" {}", fstart.format()));

                                    if let Some(fstop) = fstop {
                                        formatted.push_str(&format!(" {}", fstop.format()));

                                        if let Some(pts_per_summary) = pts_per_summary {
                                            formatted.push_str(&format!(" {}", pts_per_summary));
                                        }
                                    }
                                }
                            }
                        }
                    }
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
                let mut formatted = format!(".disto",);

                if let Some(variation) = variation {
                    formatted.push_str(&format!(" {}", variation));

                    if let Some(nx) = nx {
                        formatted.push_str(&format!(" {}", nx));

                        if let Some(fstart) = fstart {
                            formatted.push_str(&format!(" {}", fstart.format()));

                            if let Some(fstop) = fstop {
                                formatted.push_str(&format!(" {}", fstop.format()));

                                if let Some(f2overf1) = f2overf1 {
                                    formatted.push_str(&format!(" {}", f2overf1));
                                }
                            }
                        }
                    }
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
            } => {
                let mut formatted = format!(".pz",);

                if let Some(node1) = node1 {
                    formatted.push_str(&format!(" {}", node1));

                    if let Some(node2) = node2 {
                        formatted.push_str(&format!(" {}", node2));

                        if let Some(node3) = node3 {
                            formatted.push_str(&format!(" {}", node3));

                            if let Some(node4) = node4 {
                                formatted.push_str(&format!(" {}", node4));

                                if let Some(transfer_function) = transfer_function {
                                    formatted.push_str(&format!(" {}", transfer_function));

                                    if let Some(analysis_type) = analysis_type {
                                        formatted.push_str(&format!(" {}", analysis_type));
                                    }
                                }
                            }
                        }
                    }
                }

                formatted.push('\n');

                formatted
            }

            Simulation::Sens {
                output_type,
                output,
                analysis_type,
                fstart,
                fstop,
                variation,
                nx,
            } => {
                let mut formatted = format!(".sens");

                if let Some(analysis_type) = analysis_type {
                    match analysis_type {
                        SensitivityAnalysisType::Dc => {
                            if let (Some(output_type), Some(output)) = (output_type, output) {
                                formatted.push_str(&format!(" {}", output_type.format(output)));
                            }
                        }
                        SensitivityAnalysisType::Ac => {
                            if let (Some(output_type), Some(output)) = (output_type, output) {
                                formatted.push_str(&format!(" {}", output_type.format(output)));

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
                                }
                            }
                        }
                    };
                }

                formatted.push('\n');

                formatted
            }
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
                return Ok(Simulation::Ac {
                    fstart: fstart
                        .map(|fstart| {
                            Unit::from(fstart)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    fstop: fstop
                        .map(|fstop| {
                            Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
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
                return Ok(Simulation::Disto {
                    fstart: fstart
                        .map(|fstart| {
                            Unit::from(fstart)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    fstop: fstop
                        .map(|fstop| {
                            Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
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
                return Ok(Simulation::Noise {
                    output,
                    oref,
                    src,
                    variation,
                    pts,
                    fstart: fstart
                        .map(|fstart| {
                            Unit::from(fstart)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    fstop: fstop
                        .map(|fstop| {
                            Unit::from(fstop).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
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
                return Ok(Simulation::Tran {
                    tstep: tstep
                        .map(|tstep| {
                            Unit::from(tstep).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    tstop: tstop
                        .map(|tstop| {
                            Unit::from(tstop).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    tstart: tstart
                        .map(|tstart| {
                            Unit::from(tstart)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    tmax: tmax
                        .map(|tmax| {
                            Unit::from(tmax).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
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
                return Ok(Simulation::Dc {
                    srcnam,
                    vstart: vstart
                        .map(|vstart| {
                            Unit::from(vstart)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    vstop: vstop
                        .map(|vstop| {
                            Unit::from(vstop).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    vincr: vincr
                        .map(|vincr| {
                            Unit::from(vincr).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,

                    src2,
                    start2: start2
                        .map(|start2| {
                            Unit::from(start2)
                                .map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    stop2: stop2
                        .map(|stop2| {
                            Unit::from(stop2).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
                    incr2: incr2
                        .map(|incr2| {
                            Unit::from(incr2).map_err(|_| SimulatorError::MalformedSimulationConfig)
                        })
                        .transpose()?,
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
                Some(SensitivityAnalysisType::Dc) => Ok(Simulation::Sens {
                    output_type,
                    output,
                    analysis_type,
                    fstart: None,
                    fstop: None,
                    variation: None,
                    nx: None,
                }),

                Some(SensitivityAnalysisType::Ac) => {
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

                None => Err(SimulatorError::MalformedSimulationConfig),
            },
        }
    }
}
