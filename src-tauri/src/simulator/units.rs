use super::unit_of_magnitude::Unit;

#[derive(Clone)]
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

#[derive(Clone)]
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

#[derive(Clone)]

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

#[derive(Clone)]

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

#[derive(Clone)]

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
