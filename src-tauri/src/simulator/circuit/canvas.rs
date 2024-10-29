use serde::Deserialize;

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
}
