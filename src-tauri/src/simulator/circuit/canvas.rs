use serde::{Deserialize, Serialize};

use crate::simulator::circuit::element::{
    BjtModel as ContractBjtModel, BjtPolarity as ContractBjtPolarity,
};

#[derive(Deserialize, Clone)]

pub enum TimeDomainConfig {
    Dc {
        value: String,
    },
    Pulse {
        initial_value: String,
        final_value: String,
        delay: Option<String>,
        rise_time: Option<String>,
        fall_time: Option<String>,
        pulse_width: Option<String>,
        period: Option<String>,
    },
    Sin {
        offset: String,
        amplitude: String,
        frequency: Option<String>,
        delay: Option<String>,
        damping_factor: Option<String>,
    },
    Exp {
        initial_value: String,
        final_value: String,
        rise_delay: Option<String>,
        rise_time: Option<String>,
        fall_delay: Option<String>,
        fall_time: Option<String>,
    },
    Sffm {
        offset: String,
        amplitude: String,
        carrier_frequency: Option<String>,
        modulation_index: Option<i16>,
        signal_frequency: Option<String>,
    },
    Am {
        amplitude: String,
        offset: String,
        modulating_frequency: String,
        carrier_frequency: Option<String>,
        delay: Option<String>,
    },
}

#[derive(Serialize, Deserialize, Clone)]
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

#[derive(Serialize, Deserialize, Clone)]
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

#[derive(Deserialize, Clone)]

pub struct SmallSignalConfig {
    pub amplitude: String,
    pub phase: Option<String>,
}

#[derive(Deserialize, Clone)]
pub enum NodeData {
    R {
        value: String,
        name: String,
    },
    C {
        value: String,
        name: String,
    },
    L {
        value: String,
        name: String,
    },
    V {
        name: String,
        time_domain: TimeDomainConfig,
        small_signal: Option<SmallSignalConfig>,
    },
    I {
        name: String,
        time_domain: TimeDomainConfig,
        small_signal: Option<SmallSignalConfig>,
    },
    E {
        value: String,
        name: String,
    },
    F {
        value: String,
        name: String,
        src: String,
    },
    G {
        value: String,
        name: String,
    },
    H {
        value: String,
        name: String,
        src: String,
    },
    Q {
        name: String,
        model: BjtModel,
    },
    Node {},
    Gnd {},
}

#[derive(Deserialize, Clone)]
pub struct CanvasNode {
    pub id: String,
    pub data: NodeData,
}

#[derive(Deserialize, Clone)]
pub struct CanvasEdge {
    pub target: String,
    pub source: String,
    pub source_port: String,
}
