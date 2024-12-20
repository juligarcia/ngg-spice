use serde::{Deserialize, Serialize};

use super::unit_of_magnitude::Unit;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Frequency {
    base: i16,
}

impl Unit for Frequency {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Time {
    base: i16,
}

impl Unit for Time {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Resistance {
    base: i16,
}

impl Unit for Resistance {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Capacitance {
    base: i16,
}

impl Unit for Capacitance {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Inductance {
    base: i16,
}

impl Unit for Inductance {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Voltage {
    base: i16,
}

impl Unit for Voltage {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Current {
    base: i16,
}

impl Unit for Current {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Phase {
    base: i16,
}

impl Unit for Phase {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Dimensionless {
    base: i16,
}

impl Unit for Dimensionless {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Energy {
    base: i16,
}

impl Unit for Energy {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Conductance {
    base: i16,
}

impl Unit for Conductance {
    fn format(&self) -> String {
        format!("{}", self.base)
    }

    fn new(base: i16) -> Self {
        Self { base }
    }
}
