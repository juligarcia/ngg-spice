use std::collections::HashSet;

use crate::simulator::{
    circuit::canvas::{
        SmallSignalConfig as CanvasSmallSignalConfig, TimeDomainConfig as CanvasTimeDomainConfig,
    },
    simulator_error::SimulatorError,
    unit_of_magnitude::UnitOfMagnitude as Unit,
    units::{Capacitance, Frequency, Inductance, Phase, Resistance, Time, Voltage},
};

#[derive(Clone)]
pub enum TimeDomainConfig {
    Dc {
        value: Unit<Voltage>,
    },
    Pulse {
        initial_value: Unit<Voltage>,
        final_value: Unit<Voltage>,
        delay: Option<Unit<Time>>,
        rise_time: Option<Unit<Time>>,
        fall_time: Option<Unit<Time>>,
        pulse_width: Option<Unit<Time>>,
        period: Option<Unit<Time>>,
    },
    Sin {
        offset: Unit<Voltage>,
        amplitude: Unit<Voltage>,
        frequency: Option<Unit<Frequency>>,
        delay: Option<Unit<Time>>,
        damping_factor: Option<Unit<Time>>,
    },
    Exp {
        initial_value: Unit<Voltage>,
        final_value: Unit<Voltage>,
        rise_delay: Option<Unit<Time>>,
        rise_time: Option<Unit<Time>>,
        fall_delay: Option<Unit<Time>>,
        fall_time: Option<Unit<Time>>,
    },
    Sffm {
        offset: Unit<Voltage>,
        amplitude: Unit<Voltage>,
        carrier_frequency: Option<Unit<Frequency>>,
        modulation_index: Option<i16>,
        signal_frequency: Option<Unit<Frequency>>,
    },
    Am {
        amplitude: Unit<Voltage>,
        offset: Unit<Voltage>,
        modulating_frequency: Unit<Frequency>,
        carrier_frequency: Option<Unit<Frequency>>,
        delay: Option<Unit<Time>>,
    },
}

impl TimeDomainConfig {
    pub fn from_canvas(
        canvas_time_domain_config: CanvasTimeDomainConfig,
    ) -> Result<Self, SimulatorError> {
        match canvas_time_domain_config {
            CanvasTimeDomainConfig::Dc { value } => {
                let value = Unit::<Voltage>::from(value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                Ok(TimeDomainConfig::Dc { value })
            }

            CanvasTimeDomainConfig::Pulse {
                initial_value,
                final_value,
                delay,
                rise_time,
                fall_time,
                pulse_width,
                period,
            } => {
                let initial_value = Unit::<Voltage>::from(initial_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let final_value = Unit::<Voltage>::from(final_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                if let Some(delay) = delay {
                    let delay = Unit::<Time>::from(delay)
                        .map_err(|error| SimulatorError::UnitError(error))?;

                    if let Some(rise_time) = rise_time {
                        let rise_time = Unit::<Time>::from(rise_time)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        if let Some(fall_time) = fall_time {
                            let fall_time = Unit::<Time>::from(fall_time)
                                .map_err(|error| SimulatorError::UnitError(error))?;

                            if let Some(pulse_width) = pulse_width {
                                let pulse_width = Unit::<Time>::from(pulse_width)
                                    .map_err(|error| SimulatorError::UnitError(error))?;

                                if let Some(period) = period {
                                    let period = Unit::<Time>::from(period)
                                        .map_err(|error| SimulatorError::UnitError(error))?;

                                    Ok(TimeDomainConfig::Pulse {
                                        initial_value,
                                        final_value,
                                        delay: Some(delay),
                                        rise_time: Some(rise_time),
                                        fall_time: Some(fall_time),
                                        pulse_width: Some(pulse_width),
                                        period: Some(period),
                                    })
                                } else {
                                    Ok(TimeDomainConfig::Pulse {
                                        initial_value,
                                        final_value,
                                        delay: Some(delay),
                                        rise_time: Some(rise_time),
                                        fall_time: Some(fall_time),
                                        pulse_width: Some(pulse_width),
                                        period: None,
                                    })
                                }
                            } else {
                                Ok(TimeDomainConfig::Pulse {
                                    initial_value,
                                    final_value,
                                    delay: Some(delay),
                                    rise_time: Some(rise_time),
                                    fall_time: Some(fall_time),
                                    pulse_width: None,
                                    period: None,
                                })
                            }
                        } else {
                            Ok(TimeDomainConfig::Pulse {
                                initial_value,
                                final_value,
                                delay: Some(delay),
                                rise_time: Some(rise_time),
                                fall_time: None,
                                pulse_width: None,
                                period: None,
                            })
                        }
                    } else {
                        Ok(TimeDomainConfig::Pulse {
                            initial_value,
                            final_value,
                            delay: Some(delay),
                            rise_time: None,
                            fall_time: None,
                            pulse_width: None,
                            period: None,
                        })
                    }
                } else {
                    Ok(TimeDomainConfig::Pulse {
                        initial_value,
                        final_value,
                        delay: None,
                        rise_time: None,
                        fall_time: None,
                        pulse_width: None,
                        period: None,
                    })
                }
            }

            CanvasTimeDomainConfig::Exp {
                initial_value,
                final_value,
                rise_delay,
                rise_time,
                fall_delay,
                fall_time,
            } => {
                let initial_value = Unit::<Voltage>::from(initial_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let final_value = Unit::<Voltage>::from(final_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                if let Some(rise_delay) = rise_delay {
                    let rise_delay = Unit::<Time>::from(rise_delay)
                        .map_err(|error| SimulatorError::UnitError(error))?;

                    if let Some(rise_time) = rise_time {
                        let rise_time = Unit::<Time>::from(rise_time)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        if let Some(fall_delay) = fall_delay {
                            let fall_delay = Unit::<Time>::from(fall_delay)
                                .map_err(|error| SimulatorError::UnitError(error))?;

                            if let Some(fall_time) = fall_time {
                                let fall_time = Unit::<Time>::from(fall_time)
                                    .map_err(|error| SimulatorError::UnitError(error))?;

                                Ok(TimeDomainConfig::Exp {
                                    initial_value,
                                    final_value,
                                    rise_delay: Some(rise_delay),
                                    rise_time: Some(rise_time),
                                    fall_delay: Some(fall_delay),
                                    fall_time: Some(fall_time),
                                })
                            } else {
                                Ok(TimeDomainConfig::Exp {
                                    initial_value,
                                    final_value,
                                    rise_delay: Some(rise_delay),
                                    rise_time: Some(rise_time),
                                    fall_delay: Some(fall_delay),
                                    fall_time: None,
                                })
                            }
                        } else {
                            Ok(TimeDomainConfig::Exp {
                                initial_value,
                                final_value,
                                rise_delay: Some(rise_delay),
                                rise_time: Some(rise_time),
                                fall_delay: None,
                                fall_time: None,
                            })
                        }
                    } else {
                        Ok(TimeDomainConfig::Exp {
                            initial_value,
                            final_value,
                            rise_delay: Some(rise_delay),
                            rise_time: None,
                            fall_delay: None,
                            fall_time: None,
                        })
                    }
                } else {
                    Ok(TimeDomainConfig::Exp {
                        initial_value,
                        final_value,
                        rise_delay: None,
                        rise_time: None,
                        fall_delay: None,
                        fall_time: None,
                    })
                }
            }

            CanvasTimeDomainConfig::Sin {
                offset,
                amplitude,
                frequency,
                delay,
                damping_factor,
            } => {
                let offset = Unit::<Voltage>::from(offset)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude = Unit::<Voltage>::from(amplitude)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                if let Some(frequency) = frequency {
                    let frequency = Unit::<Frequency>::from(frequency)
                        .map_err(|error| SimulatorError::UnitError(error))?;

                    if let Some(delay) = delay {
                        let delay = Unit::<Time>::from(delay)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        if let Some(damping_factor) = damping_factor {
                            let damping_factor = Unit::<Time>::from(damping_factor)
                                .map_err(|error| SimulatorError::UnitError(error))?;

                            Ok(TimeDomainConfig::Sin {
                                offset,
                                amplitude,
                                frequency: Some(frequency),
                                delay: Some(delay),
                                damping_factor: Some(damping_factor),
                            })
                        } else {
                            Ok(TimeDomainConfig::Sin {
                                offset,
                                amplitude,
                                frequency: Some(frequency),
                                delay: Some(delay),
                                damping_factor: None,
                            })
                        }
                    } else {
                        Ok(TimeDomainConfig::Sin {
                            offset,
                            amplitude,
                            frequency: Some(frequency),
                            delay: None,
                            damping_factor: None,
                        })
                    }
                } else {
                    Ok(TimeDomainConfig::Sin {
                        offset,
                        amplitude,
                        frequency: None,
                        delay: None,
                        damping_factor: None,
                    })
                }
            }

            CanvasTimeDomainConfig::Sffm {
                offset,
                amplitude,
                carrier_frequency,
                modulation_index,
                signal_frequency,
            } => {
                let offset = Unit::<Voltage>::from(offset)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude = Unit::<Voltage>::from(amplitude)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                if let Some(carrier_frequency) = carrier_frequency {
                    let carrier_frequency = Unit::<Frequency>::from(carrier_frequency)
                        .map_err(|error| SimulatorError::UnitError(error))?;

                    if let Some(modulation_index) = modulation_index {
                        if let Some(signal_frequency) = signal_frequency {
                            let signal_frequency = Unit::<Frequency>::from(signal_frequency)
                                .map_err(|error| SimulatorError::UnitError(error))?;

                            Ok(TimeDomainConfig::Sffm {
                                offset,
                                amplitude,
                                carrier_frequency: Some(carrier_frequency),
                                modulation_index: Some(modulation_index),
                                signal_frequency: Some(signal_frequency),
                            })
                        } else {
                            Ok(TimeDomainConfig::Sffm {
                                offset,
                                amplitude,
                                carrier_frequency: Some(carrier_frequency),
                                modulation_index: Some(modulation_index),
                                signal_frequency: None,
                            })
                        }
                    } else {
                        Ok(TimeDomainConfig::Sffm {
                            offset,
                            amplitude,
                            carrier_frequency: Some(carrier_frequency),
                            modulation_index: None,
                            signal_frequency: None,
                        })
                    }
                } else {
                    Ok(TimeDomainConfig::Sffm {
                        offset,
                        amplitude,
                        carrier_frequency: None,
                        modulation_index: None,
                        signal_frequency: None,
                    })
                }
            }

            CanvasTimeDomainConfig::Am {
                amplitude,
                offset,
                modulating_frequency,
                carrier_frequency,
                delay,
            } => {
                let offset = Unit::<Voltage>::from(offset)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude = Unit::<Voltage>::from(amplitude)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let modulating_frequency = Unit::<Frequency>::from(modulating_frequency)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                if let Some(carrier_frequency) = carrier_frequency {
                    let carrier_frequency = Unit::<Frequency>::from(carrier_frequency)
                        .map_err(|error| SimulatorError::UnitError(error))?;

                    if let Some(delay) = delay {
                        let delay = Unit::<Time>::from(delay)
                            .map_err(|error| SimulatorError::UnitError(error))?;

                        Ok(TimeDomainConfig::Am {
                            amplitude,
                            offset,
                            modulating_frequency,
                            carrier_frequency: Some(carrier_frequency),
                            delay: Some(delay),
                        })
                    } else {
                        Ok(TimeDomainConfig::Am {
                            amplitude,
                            offset,
                            modulating_frequency,
                            carrier_frequency: Some(carrier_frequency),
                            delay: None,
                        })
                    }
                } else {
                    Ok(TimeDomainConfig::Am {
                        amplitude,
                        offset,
                        modulating_frequency,
                        carrier_frequency: None,
                        delay: None,
                    })
                }
            }
        }
    }

    pub fn format(&self) -> String {
        match self {
            TimeDomainConfig::Dc { value } => format!("DC {}", value.format()),
            TimeDomainConfig::Pulse {
                initial_value,
                final_value,
                delay,
                rise_time,
                fall_time,
                pulse_width,
                period,
            } => {
                let mut formatted =
                    format!("PULSE({} {}", initial_value.format(), final_value.format());

                if let Some(delay) = delay {
                    formatted.push_str(&format!(" {}", delay.format()));

                    if let Some(rise_time) = rise_time {
                        formatted.push_str(&format!(" {}", rise_time.format()));

                        if let Some(fall_time) = fall_time {
                            formatted.push_str(&format!(" {}", fall_time.format()));

                            if let Some(pulse_width) = pulse_width {
                                formatted.push_str(&format!(" {}", pulse_width.format()));

                                if let Some(period) = period {
                                    formatted.push_str(&format!(" {}", period.format()));
                                }
                            }
                        }
                    }
                }

                formatted.push_str(&format!(")"));

                formatted
            }
            TimeDomainConfig::Sin {
                offset,
                amplitude,
                frequency,
                delay,
                damping_factor,
            } => {
                let mut formatted = format!("SIN({} {}", offset.format(), amplitude.format());

                if let Some(frequency) = frequency {
                    formatted.push_str(&format!(" {}", frequency.format()));

                    if let Some(delay) = delay {
                        formatted.push_str(&format!(" {}", delay.format()));

                        if let Some(damping_factor) = damping_factor {
                            formatted.push_str(&format!(" {}", damping_factor.format()));
                        }
                    }
                }

                formatted.push_str(&format!(")"));

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
                let mut formatted =
                    format!("EXP({} {}", initial_value.format(), final_value.format());

                if let Some(rise_delay) = rise_delay {
                    formatted.push_str(&format!(" {}", rise_delay.format()));

                    if let Some(rise_time) = rise_time {
                        formatted.push_str(&format!(" {}", rise_time.format()));

                        if let Some(fall_delay) = fall_delay {
                            formatted.push_str(&format!(" {}", fall_delay.format()));

                            if let Some(fall_time) = fall_time {
                                formatted.push_str(&format!(" {}", fall_time.format()));
                            }
                        }
                    }
                }

                formatted.push_str(&format!(")"));

                formatted
            }

            TimeDomainConfig::Sffm {
                offset,
                amplitude,
                carrier_frequency,
                modulation_index,
                signal_frequency,
            } => {
                let mut formatted = format!("SFFM({} {}", offset.format(), amplitude.format());

                if let Some(carrier_frequency) = carrier_frequency {
                    formatted.push_str(&format!(" {}", carrier_frequency.format()));

                    if let Some(modulation_index) = modulation_index {
                        formatted.push_str(&format!(" {}", modulation_index));

                        if let Some(signal_frequency) = signal_frequency {
                            formatted.push_str(&format!(" {}", signal_frequency.format()));
                        }
                    }
                }

                formatted.push_str(&format!(")"));

                formatted
            }

            TimeDomainConfig::Am {
                amplitude,
                offset,
                modulating_frequency,
                carrier_frequency,
                delay,
            } => {
                let mut formatted = format!(
                    "AM({} {} {}",
                    amplitude.format(),
                    offset.format(),
                    modulating_frequency.format()
                );

                if let Some(carrier_frequency) = carrier_frequency {
                    formatted.push_str(&format!(" {}", carrier_frequency.format()));

                    if let Some(delay) = delay {
                        formatted.push_str(&format!(" {}", delay.format()));
                    }
                }

                formatted.push_str(&format!(")"));

                formatted
            }
        }
    }
}

#[derive(Clone)]
pub struct SmallSignalConfig {
    amplitude: Unit<Voltage>,
    phase: Option<Unit<Phase>>,
}

impl SmallSignalConfig {
    pub fn from_canvas(
        small_signal_config: CanvasSmallSignalConfig,
    ) -> Result<SmallSignalConfig, SimulatorError> {
        let amplitude = Unit::<Voltage>::from(small_signal_config.amplitude)
            .map_err(|error| SimulatorError::UnitError(error))?;

        if let Some(phase) = small_signal_config.phase {
            let phase =
                Unit::<Phase>::from(phase).map_err(|error| SimulatorError::UnitError(error))?;

            return Ok(SmallSignalConfig {
                amplitude,
                phase: Some(phase),
            });
        }

        return Ok(SmallSignalConfig {
            amplitude,
            phase: None,
        });
    }

    pub fn format(&self) -> String {
        let mut formatted = format!("AC {}", self.amplitude.format());

        if let Some(phase) = &self.phase {
            formatted.push_str(&format!(" {}", phase.format()));
        }

        formatted
    }
}

#[derive(Clone)]
pub enum Element {
    R(String, Unit<Resistance>, String, String),
    C(String, Unit<Capacitance>, String, String),
    L(String, Unit<Inductance>, String, String),
    V(
        String,
        TimeDomainConfig,
        Option<SmallSignalConfig>,
        String,
        String,
    ),
}

impl Element {
    fn replace_ground_alias(nodes: &[&str], ground_alias: &HashSet<String>) -> Vec<String> {
        nodes
            .into_iter()
            .map(|&node| {
                if ground_alias.contains(node) {
                    "gnd".to_owned()
                } else {
                    node.to_owned()
                }
            })
            .collect()
    }

    pub fn get_netlist_representation(
        &self,
        ground_alias: &HashSet<String>,
    ) -> Result<String, SimulatorError> {
        match &self {
            Element::R(name, value, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    return Ok(format!("R{} {} {} {}\n", name, n1, n2, value.format()));
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::C(name, value, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    return Ok(format!("C{} {} {} {}\n", name, n1, n2, value.format()));
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::L(name, value, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    return Ok(format!("L{} {} {} {}\n", name, n1, n2, value.format()));
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::V(name, time_domain_config, small_signal_config, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    let mut formatted =
                        format!("V{} {} {} {}", name, n1, n2, time_domain_config.format());

                    if let Some(small_signal_config) = small_signal_config {
                        formatted.push_str(&format!(" {}", small_signal_config.format()));
                    }

                    formatted.push('\n');

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }
        }
    }
}
