use std::collections::HashMap;

use serde::{Deserialize, Serialize};

use crate::{
    common::numbers::position::Position,
    simulator::{
        circuit::element::{BjtModel as ContractBjtModel, BjtPolarity as ContractBjtPolarity},
        simulation::SimulationConfig,
        unit_of_magnitude::UnitOfMagnitude,
    },
};

#[derive(Deserialize, Clone, Serialize, Debug)]
pub enum TimeDomainConfig {
    Dc {
        value: Option<String>,
    },
    Pulse {
        initial_value: Option<String>,
        final_value: Option<String>,
        delay: Option<String>,
        rise_time: Option<String>,
        fall_time: Option<String>,
        pulse_width: Option<String>,
        period: Option<String>,
    },
    Sin {
        offset: Option<String>,
        amplitude: Option<String>,
        frequency: Option<String>,
        delay: Option<String>,
        damping_factor: Option<String>,
    },
    Exp {
        initial_value: Option<String>,
        final_value: Option<String>,
        rise_delay: Option<String>,
        rise_time: Option<String>,
        fall_delay: Option<String>,
        fall_time: Option<String>,
    },
    Sffm {
        offset: Option<String>,
        amplitude: Option<String>,
        carrier_frequency: Option<String>,
        modulation_index: Option<i16>,
        signal_frequency: Option<String>,
    },
    Am {
        amplitude: Option<String>,
        offset: Option<String>,
        modulating_frequency: Option<String>,
        carrier_frequency: Option<String>,
        delay: Option<String>,
    },
}

impl TimeDomainConfig {
    pub fn to_gsp_string(&self) -> String {
        match self {
            TimeDomainConfig::Am {
                amplitude,
                offset,
                modulating_frequency,
                carrier_frequency,
                delay,
            } => {
                let mut formatted = format!("AM");

                if let Some(amplitude) = amplitude {
                    formatted.push_str(&format!(" {}", amplitude));

                    if let Some(offset) = offset {
                        formatted.push_str(&format!(" {}", offset));

                        if let Some(modulating_frequency) = modulating_frequency {
                            formatted.push_str(&format!(" {}", modulating_frequency));

                            if let Some(carrier_frequency) = carrier_frequency {
                                formatted.push_str(&format!(" {}", carrier_frequency));

                                if let Some(delay) = delay {
                                    formatted.push_str(&format!(" {}", delay));
                                }
                            }
                        }
                    }
                }

                formatted
            }

            TimeDomainConfig::Dc { value } => {
                let mut formatted = format!("DC");

                if let Some(value) = value {
                    formatted.push_str(&format!(" {}", value));
                }

                formatted
            }

            TimeDomainConfig::Exp {
                initial_value,
                final_value,
                rise_delay,
                rise_time,
                fall_delay,
                fall_time,
            } => {
                let mut formatted = format!("EXP");

                if let Some(initial_value) = initial_value {
                    formatted.push_str(&format!(" {}", initial_value));

                    if let Some(final_value) = final_value {
                        formatted.push_str(&format!(" {}", final_value));

                        if let Some(rise_delay) = rise_delay {
                            formatted.push_str(&format!(" {}", rise_delay));

                            if let Some(rise_time) = rise_time {
                                formatted.push_str(&format!(" {}", rise_time));

                                if let Some(fall_delay) = fall_delay {
                                    formatted.push_str(&format!(" {}", fall_delay));

                                    if let Some(fall_time) = fall_time {
                                        formatted.push_str(&format!(" {}", fall_time));
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }

            TimeDomainConfig::Pulse {
                initial_value,
                final_value,
                delay,
                rise_time,
                fall_time,
                pulse_width,
                period,
            } => {
                let mut formatted = format!("PULSE");

                if let Some(initial_value) = initial_value {
                    formatted.push_str(&format!(" {}", initial_value));

                    if let Some(final_value) = final_value {
                        formatted.push_str(&format!(" {}", final_value));

                        if let Some(delay) = delay {
                            formatted.push_str(&format!(" {}", delay));

                            if let Some(rise_time) = rise_time {
                                formatted.push_str(&format!(" {}", rise_time));

                                if let Some(fall_time) = fall_time {
                                    formatted.push_str(&format!(" {}", fall_time));

                                    if let Some(pulse_width) = pulse_width {
                                        formatted.push_str(&format!(" {}", pulse_width));

                                        if let Some(period) = period {
                                            formatted.push_str(&format!(" {}", period));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                formatted
            }

            TimeDomainConfig::Sffm {
                offset,
                amplitude,
                carrier_frequency,
                modulation_index,
                signal_frequency,
            } => {
                let mut formatted = format!("SFFM");

                if let Some(offset) = offset {
                    formatted.push_str(&format!(" {}", offset));

                    if let Some(amplitude) = amplitude {
                        formatted.push_str(&format!(" {}", amplitude));

                        if let Some(carrier_frequency) = carrier_frequency {
                            formatted.push_str(&format!(" {}", carrier_frequency));

                            if let Some(modulation_index) = modulation_index {
                                formatted.push_str(&format!(" {}", modulation_index));

                                if let Some(signal_frequency) = signal_frequency {
                                    formatted.push_str(&format!(" {}", signal_frequency));
                                }
                            }
                        }
                    }
                }

                formatted
            }

            TimeDomainConfig::Sin {
                offset,
                amplitude,
                frequency,
                delay,
                damping_factor,
            } => {
                let mut formatted = format!("SINE");

                if let Some(offset) = offset {
                    formatted.push_str(&format!(" {}", offset));

                    if let Some(amplitude) = amplitude {
                        formatted.push_str(&format!(" {}", amplitude));

                        if let Some(frequency) = frequency {
                            formatted.push_str(&format!(" {}", frequency));

                            if let Some(delay) = delay {
                                formatted.push_str(&format!(" {}", delay));

                                if let Some(damping_factor) = damping_factor {
                                    formatted.push_str(&format!(" {}", damping_factor));
                                }
                            }
                        }
                    }
                }

                formatted
            }
        }
    }

    pub fn from_space_separated_string(kind: &str, value: &str) -> Option<TimeDomainConfig> {
        match kind.to_lowercase().as_str() {
            "pulse" => {
                let mut parts = value.split_whitespace();
                let initial_value = parts.next();
                let final_value = parts.next();
                let delay = parts.next();
                let rise_time = parts.next();
                let fall_time = parts.next();
                let pulse_width = parts.next();
                let period = parts.next();

                Some(TimeDomainConfig::Pulse {
                    initial_value: initial_value.map(|s| s.to_string()),
                    final_value: final_value.map(|s| s.to_string()),
                    delay: delay.map(|s| s.to_string()),
                    rise_time: rise_time.map(|s| s.to_string()),
                    fall_time: fall_time.map(|s| s.to_string()),
                    pulse_width: pulse_width.map(|s| s.to_string()),
                    period: period.map(|s| s.to_string()),
                })
            }
            "sine" => {
                let mut parts = value.split_whitespace();
                let offset = parts.next();
                let amplitude = parts.next();
                let frequency = parts.next();
                let delay = parts.next();
                let damping_factor = parts.next();

                Some(TimeDomainConfig::Sin {
                    offset: offset.map(|s| s.to_string()),
                    amplitude: amplitude.map(|s| s.to_string()),
                    frequency: frequency.map(|s| s.to_string()),
                    delay: delay.map(|s| s.to_string()),
                    damping_factor: damping_factor.map(|s| s.to_string()),
                })
            }
            "exp" => {
                let mut parts = value.split_whitespace();
                let initial_value = parts.next();
                let final_value = parts.next();
                let rise_delay = parts.next();
                let rise_time = parts.next();
                let fall_delay = parts.next();
                let fall_time = parts.next();

                Some(TimeDomainConfig::Exp {
                    initial_value: initial_value.map(|s| s.to_string()),
                    final_value: final_value.map(|s| s.to_string()),
                    rise_delay: rise_delay.map(|s| s.to_string()),
                    rise_time: rise_time.map(|s| s.to_string()),
                    fall_delay: fall_delay.map(|s| s.to_string()),
                    fall_time: fall_time.map(|s| s.to_string()),
                })
            }
            "sffm" => {
                let mut parts = value.split_whitespace();
                let offset = parts.next();
                let amplitude = parts.next();
                let carrier_frequency = parts.next();
                let modulation_index = parts.next();
                let signal_frequency = parts.next();

                Some(TimeDomainConfig::Sffm {
                    offset: offset.map(|s| s.to_string()),
                    amplitude: amplitude.map(|s| s.to_string()),
                    carrier_frequency: carrier_frequency.map(|s| s.to_string()),
                    modulation_index: modulation_index.map(|s| s.parse().unwrap()),
                    signal_frequency: signal_frequency.map(|s| s.to_string()),
                })
            }
            "am" => {
                let mut parts = value.split_whitespace();
                let amplitude = parts.next();
                let offset = parts.next();
                let modulating_frequency = parts.next();
                let carrier_frequency = parts.next();
                let delay = parts.next();

                Some(TimeDomainConfig::Am {
                    amplitude: amplitude.map(|s| s.to_string()),
                    offset: offset.map(|s| s.to_string()),
                    modulating_frequency: modulating_frequency.map(|s| s.to_string()),
                    carrier_frequency: carrier_frequency.map(|s| s.to_string()),
                    delay: delay.map(|s| s.to_string()),
                })
            }

            "dc" => Some(TimeDomainConfig::Dc {
                value: Some(
                    UnitOfMagnitude::from("dc".to_string())
                        .or::<Result<UnitOfMagnitude, ()>>(Ok(UnitOfMagnitude::Base(0.0)))
                        .unwrap()
                        .format(),
                ),
            }),

            _ => None,
        }
    }

    pub fn from_gsp_value_string(value: &str) -> Option<TimeDomainConfig> {
        if value.is_empty() {
            return None;
        }

        if let Some((kind, attributes)) = value.split_once(" ") {
            return TimeDomainConfig::from_space_separated_string(&kind, &attributes);
        }

        None
    }

    pub fn from_asc_value_string(value: &str) -> Option<TimeDomainConfig> {
        // Empty string LTSpice representation
        if value == "\"\"" || value.is_empty() {
            return None;
        }

        if let Ok(unit) = UnitOfMagnitude::from(value.to_string()) {
            return Some(TimeDomainConfig::Dc {
                value: Some(unit.format()),
            });
        }

        let mut parts = value.split("(");
        let kind = parts.next().unwrap().to_lowercase();
        let attributes = parts.next().unwrap().replace(")", "");

        TimeDomainConfig::from_space_separated_string(&kind, &attributes)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct BjtModel {
    pub name: String,
    pub polarity: BjtPolarity,

    pub is: Option<String>,  // Transport saturation current
    pub xti: Option<String>, // IS temperature effect exponent
    pub eg: Option<String>,  // Bandgap voltage (barrier height)
    pub vaf: Option<String>, // Forward Early voltage
    pub bf: Option<String>,  // Ideal maximum forward beta
    pub ise: Option<String>, // Base-emitter leakage saturation current
    pub ne: Option<String>,  // Base-emitter leakage emission coefficient
    pub ikf: Option<String>, // Corner for forward-beta high-current roll-off
    pub nk: Option<String>,  // High-current roll-off coefficient
    pub xtb: Option<String>, // Forward and reverse beta temperature coefficient
    pub br: Option<String>,  // Ideal maximum reverse beta
    pub isc: Option<String>, // Base-collector leakage saturation current
    pub nc: Option<String>,  // Base-collector leakage emission coefficient
    pub ikr: Option<String>, // Corner for reverse-beta high-current roll-off
    pub rc: Option<String>,  // Collector ohmic resistance
    pub cjc: Option<String>, // Base-collector zero-bias p-n capacitance
    pub mjc: Option<String>, // Base-collector p-n grading factor
    pub vjc: Option<String>, // Base-collector built-in potential
    pub fc: Option<String>,  // Forward-bias depletion capacitor coefficient
    pub cje: Option<String>, // Base-emitter zero-bias p-n capacitance
    pub mje: Option<String>, // Base-emitter p-n grading factor
    pub vje: Option<String>, // Base-emitter built-in potential
    pub tr: Option<String>,  // Ideal reverse transit time
    pub tf: Option<String>,  // Ideal forward transit time
    pub itf: Option<String>, // Transit time dependency on Ic
    pub xtf: Option<String>, // Transit time bias dependence coefficient
    pub vtf: Option<String>, // Transit time dependency on Vbc
    pub rb: Option<String>,  // Zero-bias (maximum) base resistance
}

impl BjtModel {
    pub fn to_domain(&self) -> ContractBjtModel {
        ContractBjtModel::from_canvas(&self)
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum BjtPolarity {
    NPN,
    PNP,
}

impl BjtPolarity {
    pub fn to_domain(&self) -> ContractBjtPolarity {
        match self {
            BjtPolarity::NPN => ContractBjtPolarity::Npn,
            BjtPolarity::PNP => ContractBjtPolarity::Pnp,
        }
    }
}

#[derive(Deserialize, Clone, Serialize, Debug)]
pub struct SmallSignalConfig {
    pub amplitude: String,
    pub phase: Option<String>,
}

impl SmallSignalConfig {
    pub fn to_gsp_string(&self) -> String {
        let mut formatted = format!("AC {}", self.amplitude);

        if let Some(phase) = &self.phase {
            formatted.push_str(&format!(" {}", phase));
        }

        formatted
    }

    pub fn from_gsp_value_string(value: &str) -> Option<SmallSignalConfig> {
        if value.is_empty() {
            return None;
        }

        let mut parts = value.split_whitespace();
        // Read AC prefix
        let _ac = parts.next().unwrap();
        let amplitude = parts.next().or(Some("0")).unwrap();
        let phase = parts.next();

        Some(SmallSignalConfig {
            amplitude: amplitude.to_string(),
            phase: phase.map(|s| s.to_string()),
        })
    }

    pub fn from_asc_value_string(value: &str) -> SmallSignalConfig {
        let mut parts = value.split_whitespace();
        // Read AC prefix
        let _ac = parts.next().unwrap();
        let amplitude = parts.next().or(Some("0")).unwrap();
        let phase = parts.next();

        SmallSignalConfig {
            amplitude: amplitude.to_string(),
            phase: phase.map(|s| s.to_string()),
        }
    }
}

#[derive(Deserialize, Clone, Serialize, Debug)]
pub enum NodeData {
    R {
        value: Option<String>,
        name: String,
        position: Position,
    },
    C {
        value: Option<String>,
        name: String,
        position: Position,
    },
    L {
        value: Option<String>,
        name: String,
        position: Position,
    },
    V {
        name: String,
        time_domain: Option<TimeDomainConfig>,
        small_signal: Option<SmallSignalConfig>,
        position: Position,
    },
    I {
        name: String,
        time_domain: Option<TimeDomainConfig>,
        small_signal: Option<SmallSignalConfig>,
        position: Position,
    },
    E {
        value: Option<String>,
        name: String,
        position: Position,
    },
    F {
        value: Option<String>,
        name: String,
        src: Option<String>,
        position: Position,
    },
    G {
        value: Option<String>,
        name: String,
        position: Position,
    },
    H {
        value: Option<String>,
        name: String,
        src: Option<String>,
        position: Position,
    },
    Q {
        name: String,
        model: Option<BjtModel>,
        position: Position,
    },
    Node {
        name: String,
        position: Position,
    },
    Gnd {
        position: Position,
    },
}

#[derive(Deserialize, Clone, Serialize, Debug)]
pub struct CanvasNode {
    pub id: String,
    pub rotation: i32,
    pub data: NodeData,
}

#[derive(Deserialize, Clone, Serialize)]
pub struct CanvasEdge {
    pub target: String,
    pub source: String,
    pub source_port: String,
    pub target_port: String,
    pub target_alias: Option<String>,
}

#[derive(Deserialize, Clone, Serialize)]
pub struct CanvasData {
    pub nodes: Vec<CanvasNode>,
    pub edges: Vec<CanvasEdge>,
    pub config: HashMap<String, SimulationConfig>,
}
