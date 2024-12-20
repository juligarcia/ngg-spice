use crate::simulator::{
    circuit::canvas::{
        BjtModel as CanvasBjtModel, BjtPolarity as CanvasBjtPolarity,
        SmallSignalConfig as CanvasSmallSignalConfig, TimeDomainConfig as CanvasTimeDomainConfig,
    },
    simulator_error::SimulatorError,
    unit_of_magnitude::{Unit as UnitTrait, UnitOfMagnitude as Unit},
    units::{
        Capacitance, Conductance, Current, Dimensionless, Energy, Frequency, Inductance, Phase,
        Resistance, Time, Voltage,
    },
};
use native_db::{native_db, ToKey};
use native_model::{native_model, Model};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;

#[derive(Clone)]
pub enum TimeDomainConfig<T: UnitTrait> {
    Dc {
        value: Unit<T>,
    },
    Pulse {
        initial_value: Unit<T>,
        final_value: Unit<T>,
        delay: Option<Unit<Time>>,
        rise_time: Option<Unit<Time>>,
        fall_time: Option<Unit<Time>>,
        pulse_width: Option<Unit<Time>>,
        period: Option<Unit<Time>>,
    },
    Sin {
        offset: Unit<T>,
        amplitude: Unit<T>,
        frequency: Option<Unit<Frequency>>,
        delay: Option<Unit<Time>>,
        damping_factor: Option<Unit<Time>>,
    },
    Exp {
        initial_value: Unit<T>,
        final_value: Unit<T>,
        rise_delay: Option<Unit<Time>>,
        rise_time: Option<Unit<Time>>,
        fall_delay: Option<Unit<Time>>,
        fall_time: Option<Unit<Time>>,
    },
    Sffm {
        offset: Unit<T>,
        amplitude: Unit<T>,
        carrier_frequency: Option<Unit<Frequency>>,
        modulation_index: Option<i16>,
        signal_frequency: Option<Unit<Frequency>>,
    },
    Am {
        amplitude: Unit<T>,
        offset: Unit<T>,
        modulating_frequency: Unit<Frequency>,
        carrier_frequency: Option<Unit<Frequency>>,
        delay: Option<Unit<Time>>,
    },
}

impl<T: UnitTrait> TimeDomainConfig<T> {
    pub fn from_canvas(
        canvas_time_domain_config: CanvasTimeDomainConfig,
    ) -> Result<Self, SimulatorError> {
        match canvas_time_domain_config {
            CanvasTimeDomainConfig::Dc { value } => {
                let value =
                    Unit::<T>::from(value).map_err(|error| SimulatorError::UnitError(error))?;

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
                let initial_value = Unit::<T>::from(initial_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let final_value = Unit::<T>::from(final_value)
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
                let initial_value = Unit::<T>::from(initial_value)
                    .map_err(|error| SimulatorError::UnitError(error))?;

                let final_value = Unit::<T>::from(final_value)
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
                let offset =
                    Unit::<T>::from(offset).map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude =
                    Unit::<T>::from(amplitude).map_err(|error| SimulatorError::UnitError(error))?;

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
                let offset =
                    Unit::<T>::from(offset).map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude =
                    Unit::<T>::from(amplitude).map_err(|error| SimulatorError::UnitError(error))?;

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
                let offset =
                    Unit::<T>::from(offset).map_err(|error| SimulatorError::UnitError(error))?;

                let amplitude =
                    Unit::<T>::from(amplitude).map_err(|error| SimulatorError::UnitError(error))?;

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
pub struct SmallSignalConfig<T: UnitTrait> {
    amplitude: Unit<T>,
    phase: Option<Unit<Phase>>,
}

impl<T: UnitTrait> SmallSignalConfig<T> {
    pub fn from_canvas(
        small_signal_config: CanvasSmallSignalConfig,
    ) -> Result<SmallSignalConfig<T>, SimulatorError> {
        let amplitude = Unit::<T>::from(small_signal_config.amplitude)
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum BjtPolarity {
    Npn,
    Pnp,
}

impl BjtPolarity {
    pub fn format(&self) -> String {
        match self {
            BjtPolarity::Npn => "NPN".to_string(),
            BjtPolarity::Pnp => "PNP".to_string(),
        }
    }

    pub fn to_canvas(&self) -> CanvasBjtPolarity {
        match self {
            BjtPolarity::Npn => CanvasBjtPolarity::NPN,
            BjtPolarity::Pnp => CanvasBjtPolarity::PNP,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[native_model(id = 1, version = 1)]
#[native_db]
pub struct BjtModel {
    #[primary_key]
    pub name: String,

    pub polarity: BjtPolarity,

    pub is: Option<Unit<Current>>, // Transport saturation current
    pub xti: Option<Unit<Dimensionless>>, // IS temperature effect exponent
    pub eg: Option<Unit<Energy>>,  // Bandgap voltage (barrier height)
    pub vaf: Option<Unit<Voltage>>, // Forward Early voltage
    pub bf: Option<Unit<Dimensionless>>, // Ideal maximum forward beta
    pub ise: Option<Unit<Current>>, // Base-emitter leakage saturation current
    pub ne: Option<Unit<Dimensionless>>, // Base-emitter leakage emission coefficient
    pub ikf: Option<Unit<Current>>, // Corner for forward-beta high-current roll-off
    pub nk: Option<Unit<Dimensionless>>, // High-current roll-off coefficient
    pub xtb: Option<Unit<Dimensionless>>, // Forward and reverse beta temperature coefficient
    pub br: Option<Unit<Dimensionless>>, // Ideal maximum reverse beta
    pub isc: Option<Unit<Current>>, // Base-collector leakage saturation current
    pub nc: Option<Unit<Dimensionless>>, // Base-collector leakage emission coefficient
    pub ikr: Option<Unit<Current>>, // Corner for reverse-beta high-current roll-off
    pub rc: Option<Unit<Resistance>>, // Collector ohmic resistance
    pub cjc: Option<Unit<Capacitance>>, // Base-collector zero-bias p-n capacitance
    pub mjc: Option<Unit<Dimensionless>>, // Base-collector p-n grading factor
    pub vjc: Option<Unit<Voltage>>, // Base-collector built-in potential
    pub fc: Option<Unit<Dimensionless>>, // Forward-bias depletion capacitor coefficient
    pub cje: Option<Unit<Capacitance>>, // Base-emitter zero-bias p-n capacitance
    pub mje: Option<Unit<Dimensionless>>, // Base-emitter p-n grading factor
    pub vje: Option<Unit<Voltage>>, // Base-emitter built-in potential
    pub tr: Option<Unit<Time>>,    // Ideal reverse transit time
    pub tf: Option<Unit<Time>>,    // Ideal forward transit time
    pub itf: Option<Unit<Current>>, // Transit time dependency on Ic
    pub xtf: Option<Unit<Dimensionless>>, // Transit time bias dependence coefficient
    pub vtf: Option<Unit<Voltage>>, // Transit time dependency on Vbc
    pub rb: Option<Unit<Resistance>>, // Zero-bias (maximum) base resistance
}

impl BjtModel {
    pub fn to_canvas(&self) -> CanvasBjtModel {
        CanvasBjtModel {
            name: self.name.to_owned(),
            polarity: self.polarity.to_canvas(),

            is: if let Some(unit) = &self.is {
                Some(unit.format())
            } else {
                None
            },
            xti: if let Some(unit) = &self.xti {
                Some(unit.format())
            } else {
                None
            },
            eg: if let Some(unit) = &self.eg {
                Some(unit.format())
            } else {
                None
            },
            vaf: if let Some(unit) = &self.vaf {
                Some(unit.format())
            } else {
                None
            },
            bf: if let Some(unit) = &self.bf {
                Some(unit.format())
            } else {
                None
            },
            ise: if let Some(unit) = &self.ise {
                Some(unit.format())
            } else {
                None
            },
            ne: if let Some(unit) = &self.ne {
                Some(unit.format())
            } else {
                None
            },
            ikf: if let Some(unit) = &self.ikf {
                Some(unit.format())
            } else {
                None
            },
            nk: if let Some(unit) = &self.nk {
                Some(unit.format())
            } else {
                None
            },
            xtb: if let Some(unit) = &self.xtb {
                Some(unit.format())
            } else {
                None
            },
            br: if let Some(unit) = &self.br {
                Some(unit.format())
            } else {
                None
            },
            isc: if let Some(unit) = &self.isc {
                Some(unit.format())
            } else {
                None
            },
            nc: if let Some(unit) = &self.nc {
                Some(unit.format())
            } else {
                None
            },
            ikr: if let Some(unit) = &self.ikr {
                Some(unit.format())
            } else {
                None
            },
            rc: if let Some(unit) = &self.rc {
                Some(unit.format())
            } else {
                None
            },
            cjc: if let Some(unit) = &self.cjc {
                Some(unit.format())
            } else {
                None
            },
            mjc: if let Some(unit) = &self.mjc {
                Some(unit.format())
            } else {
                None
            },
            vjc: if let Some(unit) = &self.vjc {
                Some(unit.format())
            } else {
                None
            },
            fc: if let Some(unit) = &self.fc {
                Some(unit.format())
            } else {
                None
            },
            cje: if let Some(unit) = &self.cje {
                Some(unit.format())
            } else {
                None
            },
            mje: if let Some(unit) = &self.mje {
                Some(unit.format())
            } else {
                None
            },
            vje: if let Some(unit) = &self.vje {
                Some(unit.format())
            } else {
                None
            },
            tr: if let Some(unit) = &self.tr {
                Some(unit.format())
            } else {
                None
            },
            tf: if let Some(unit) = &self.tf {
                Some(unit.format())
            } else {
                None
            },
            itf: if let Some(unit) = &self.itf {
                Some(unit.format())
            } else {
                None
            },
            xtf: if let Some(unit) = &self.xtf {
                Some(unit.format())
            } else {
                None
            },
            vtf: if let Some(unit) = &self.vtf {
                Some(unit.format())
            } else {
                None
            },
            rb: if let Some(unit) = &self.rb {
                Some(unit.format())
            } else {
                None
            },
        }
    }

    pub fn from_canvas(canvas_model: &CanvasBjtModel) -> BjtModel {
        BjtModel {
            name: canvas_model.name.to_owned(),
            polarity: canvas_model.polarity.to_domain(),

            is: canvas_model
                .is
                .clone()
                .and_then(|is| Unit::<Current>::from(is).map_or(None, |is| Some(is))),
            xti: canvas_model
                .xti
                .clone()
                .and_then(|xti| Unit::<Dimensionless>::from(xti).map_or(None, |xti| Some(xti))),
            eg: canvas_model
                .eg
                .clone()
                .and_then(|eg| Unit::<Energy>::from(eg).map_or(None, |eg| Some(eg))),
            vaf: canvas_model
                .vaf
                .clone()
                .and_then(|vaf| Unit::<Voltage>::from(vaf).map_or(None, |vaf| Some(vaf))),
            bf: canvas_model
                .bf
                .clone()
                .and_then(|bf| Unit::<Dimensionless>::from(bf).map_or(None, |bf| Some(bf))),
            ise: canvas_model
                .ise
                .clone()
                .and_then(|ise| Unit::<Current>::from(ise).map_or(None, |ise| Some(ise))),
            ne: canvas_model
                .ne
                .clone()
                .and_then(|ne| Unit::<Dimensionless>::from(ne).map_or(None, |ne| Some(ne))),
            ikf: canvas_model
                .ikf
                .clone()
                .and_then(|ikf| Unit::<Current>::from(ikf).map_or(None, |ikf| Some(ikf))),
            nk: canvas_model
                .nk
                .clone()
                .and_then(|nk| Unit::<Dimensionless>::from(nk).map_or(None, |nk| Some(nk))),
            xtb: canvas_model
                .xtb
                .clone()
                .and_then(|xtb| Unit::<Dimensionless>::from(xtb).map_or(None, |xtb| Some(xtb))),
            br: canvas_model
                .br
                .clone()
                .and_then(|br| Unit::<Dimensionless>::from(br).map_or(None, |br| Some(br))),
            isc: canvas_model
                .isc
                .clone()
                .and_then(|isc| Unit::<Current>::from(isc).map_or(None, |isc| Some(isc))),
            nc: canvas_model
                .nc
                .clone()
                .and_then(|nc| Unit::<Dimensionless>::from(nc).map_or(None, |nc| Some(nc))),
            ikr: canvas_model
                .ikr
                .clone()
                .and_then(|ikr| Unit::<Current>::from(ikr).map_or(None, |ikr| Some(ikr))),
            rc: canvas_model
                .rc
                .clone()
                .and_then(|rc| Unit::<Resistance>::from(rc).map_or(None, |rc| Some(rc))),
            cjc: canvas_model
                .cjc
                .clone()
                .and_then(|cjc| Unit::<Capacitance>::from(cjc).map_or(None, |cjc| Some(cjc))),
            mjc: canvas_model
                .mjc
                .clone()
                .and_then(|mjc| Unit::<Dimensionless>::from(mjc).map_or(None, |mjc| Some(mjc))),
            vjc: canvas_model
                .vjc
                .clone()
                .and_then(|vjc| Unit::<Voltage>::from(vjc).map_or(None, |vjc| Some(vjc))),
            fc: canvas_model
                .fc
                .clone()
                .and_then(|fc| Unit::<Dimensionless>::from(fc).map_or(None, |fc| Some(fc))),
            cje: canvas_model
                .cje
                .clone()
                .and_then(|cje| Unit::<Capacitance>::from(cje).map_or(None, |cje| Some(cje))),
            mje: canvas_model
                .mje
                .clone()
                .and_then(|mje| Unit::<Dimensionless>::from(mje).map_or(None, |mje| Some(mje))),
            vje: canvas_model
                .vje
                .clone()
                .and_then(|vje| Unit::<Voltage>::from(vje).map_or(None, |vje| Some(vje))),
            tr: canvas_model
                .tr
                .clone()
                .and_then(|tr| Unit::<Time>::from(tr).map_or(None, |tr| Some(tr))),
            tf: canvas_model
                .tf
                .clone()
                .and_then(|tf| Unit::<Time>::from(tf).map_or(None, |tf| Some(tf))),
            itf: canvas_model
                .itf
                .clone()
                .and_then(|itf| Unit::<Current>::from(itf).map_or(None, |itf| Some(itf))),
            xtf: canvas_model
                .xtf
                .clone()
                .and_then(|xtf| Unit::<Dimensionless>::from(xtf).map_or(None, |xtf| Some(xtf))),
            vtf: canvas_model
                .vtf
                .clone()
                .and_then(|vtf| Unit::<Voltage>::from(vtf).map_or(None, |vtf| Some(vtf))),
            rb: canvas_model
                .rb
                .clone()
                .and_then(|rb| Unit::<Resistance>::from(rb).map_or(None, |rb| Some(rb))),
        }
    }

    pub fn format(&self) -> String {
        let mut formatted = format!(".model {} {}(", self.name, self.polarity.format());

        if let Some(is) = &self.is {
            formatted.push_str(&format!("IS={} ", is.format()));
        }

        if let Some(xti) = &self.xti {
            formatted.push_str(&format!("XTI={} ", xti.format()));
        }

        if let Some(eg) = &self.eg {
            formatted.push_str(&format!("EG={} ", eg.format()));
        }

        if let Some(vaf) = &self.vaf {
            formatted.push_str(&format!("VAF={} ", vaf.format()));
        }

        if let Some(bf) = &self.bf {
            formatted.push_str(&format!("BF={} ", bf.format()));
        }

        if let Some(ise) = &self.ise {
            formatted.push_str(&format!("ISE={} ", ise.format()));
        }

        if let Some(ne) = &self.ne {
            formatted.push_str(&format!("NE={} ", ne.format()));
        }

        if let Some(ikf) = &self.ikf {
            formatted.push_str(&format!("IKF={} ", ikf.format()));
        }

        if let Some(nk) = &self.nk {
            formatted.push_str(&format!("NK={} ", nk.format()));
        }

        if let Some(xtb) = &self.xtb {
            formatted.push_str(&format!("XTB={} ", xtb.format()));
        }

        if let Some(br) = &self.br {
            formatted.push_str(&format!("BR={} ", br.format()));
        }

        if let Some(isc) = &self.isc {
            formatted.push_str(&format!("ISC={} ", isc.format()));
        }

        if let Some(nc) = &self.nc {
            formatted.push_str(&format!("NC={} ", nc.format()));
        }

        if let Some(ikr) = &self.ikr {
            formatted.push_str(&format!("IKR={} ", ikr.format()));
        }

        if let Some(rc) = &self.rc {
            formatted.push_str(&format!("RC={} ", rc.format()));
        }

        if let Some(cjc) = &self.cjc {
            formatted.push_str(&format!("CJC={} ", cjc.format()));
        }

        if let Some(mjc) = &self.mjc {
            formatted.push_str(&format!("MJC={} ", mjc.format()));
        }

        if let Some(vjc) = &self.vjc {
            formatted.push_str(&format!("VJC={} ", vjc.format()));
        }

        if let Some(fc) = &self.fc {
            formatted.push_str(&format!("FC={} ", fc.format()));
        }

        if let Some(cje) = &self.cje {
            formatted.push_str(&format!("CJE={} ", cje.format()));
        }

        if let Some(mje) = &self.mje {
            formatted.push_str(&format!("MJE={} ", mje.format()));
        }

        if let Some(vje) = &self.vje {
            formatted.push_str(&format!("VJE={} ", vje.format()));
        }

        if let Some(tr) = &self.tr {
            formatted.push_str(&format!("TR={} ", tr.format()));
        }

        if let Some(tf) = &self.tf {
            formatted.push_str(&format!("TF={} ", tf.format()));
        }

        if let Some(itf) = &self.itf {
            formatted.push_str(&format!("ITF={} ", itf.format()));
        }

        if let Some(xtf) = &self.xtf {
            formatted.push_str(&format!("XTF={} ", xtf.format()));
        }

        if let Some(vtf) = &self.vtf {
            formatted.push_str(&format!("VTF={} ", vtf.format()));
        }

        if let Some(rb) = &self.rb {
            formatted.push_str(&format!("RB={} ", rb.format()));
        }

        format!("{})\n", formatted.trim_end())
    }
}

#[derive(Clone)]
pub enum Element {
    R(String, Unit<Resistance>, String, String),
    C(String, Unit<Capacitance>, String, String),
    L(String, Unit<Inductance>, String, String),
    V(
        String,
        TimeDomainConfig<Voltage>,
        Option<SmallSignalConfig<Voltage>>,
        String,
        String,
    ),
    I(
        String,
        TimeDomainConfig<Current>,
        Option<SmallSignalConfig<Current>>,
        String,
        String,
    ),
    E(String, Unit<Dimensionless>, String, String, String, String),
    F(String, Unit<Dimensionless>, String, String, String),
    G(String, Unit<Conductance>, String, String, String, String),
    H(String, Unit<Resistance>, String, String, String),
    Q(String, String, String, String, BjtModel),
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

            Element::I(name, time_domain_config, small_signal_config, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    let mut formatted =
                        format!("I{} {} {} {}", name, n1, n2, time_domain_config.format());

                    if let Some(small_signal_config) = small_signal_config {
                        formatted.push_str(&format!(" {}", small_signal_config.format()));
                    }

                    formatted.push('\n');

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::E(name, value, node1, node2, controll_node1, controll_node2) => {
                if let [n1, n2, cn1, cn2] = &Self::replace_ground_alias(
                    &[node1, node2, controll_node1, controll_node2],
                    ground_alias,
                )[0..4]
                {
                    let formatted = format!(
                        "E{} {} {} {} {} {}\n",
                        name,
                        n1,
                        n2,
                        cn1,
                        cn2,
                        value.format()
                    );

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::F(name, value, node1, node2, ref_src) => {
                if let [n1, n2, ref_src] =
                    &Self::replace_ground_alias(&[node1, node2, ref_src], ground_alias)[0..3]
                {
                    let formatted =
                        format!("F{} {} {} {} {}\n", name, n1, n2, ref_src, value.format());

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::G(name, value, node1, node2, controll_node1, controll_node2) => {
                if let [n1, n2, cn1, cn2] = &Self::replace_ground_alias(
                    &[node1, node2, controll_node1, controll_node2],
                    ground_alias,
                )[0..4]
                {
                    let formatted = format!(
                        "G{} {} {} {} {} {}\n",
                        name,
                        n1,
                        n2,
                        cn1,
                        cn2,
                        value.format()
                    );

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::H(name, value, node1, node2, ref_src) => {
                if let [n1, n2, ref_src] =
                    &Self::replace_ground_alias(&[node1, node2, ref_src], ground_alias)[0..3]
                {
                    let formatted =
                        format!("H{} {} {} {} {}\n", name, n1, n2, ref_src, value.format());

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }

            Element::Q(name, c_node, b_node, e_node, model) => {
                if let [c_node, b_node, e_node] =
                    &Self::replace_ground_alias(&[c_node, b_node, e_node], ground_alias)[0..3]
                {
                    let mut formatted = format!(
                        "Q{} {} {} {} {}\n",
                        name,
                        c_node,
                        b_node,
                        e_node,
                        model.name.to_owned()
                    );

                    formatted.push_str(&model.format());

                    return Ok(formatted);
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }
        }
    }
}
