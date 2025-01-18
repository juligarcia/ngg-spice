use crate::common::numbers::position::Position;

use super::engine::Rotation;

pub enum LTSpicePorts {
    // ...Ports in order, Offset to origin, default rotation relative to Graphi Spice
    Resistor(Position, Position, Position, Rotation),
    Capacitor(Position, Position, Position, Rotation),
    Inductor(Position, Position, Position, Rotation),
    Ground(Position),
    Bjt(Position, Position, Position, Position, Rotation),
    VoltagePowerSupply(Position, Position, Position, Rotation),
    CurrentPowerSupply(Position, Position, Position, Rotation),
}

// Ports are in spice usage order

pub const LT_SPICE_R_PORTS: LTSpicePorts = LTSpicePorts::Resistor(
    Position { x: 16, y: 16 },
    Position { x: 16, y: 96 },
    Position { x: 16, y: 56 },
    Rotation::Ninety,
);

pub const LT_SPICE_C_PORTS: LTSpicePorts = LTSpicePorts::Capacitor(
    Position { x: 16, y: 0 },
    Position { x: 16, y: 64 },
    Position { x: 16, y: 32 },
    Rotation::Ninety,
);

pub const LT_SPICE_I_PORTS: LTSpicePorts = LTSpicePorts::Inductor(
    Position { x: 16, y: 16 },
    Position { x: 16, y: 96 },
    Position { x: 16, y: 56 },
    Rotation::Ninety,
);

pub const LT_SPICE_BJT_PORTS: LTSpicePorts = LTSpicePorts::Bjt(
    Position { x: 64, y: 0 },
    Position { x: 0, y: 48 },
    Position { x: 64, y: 96 },
    Position { x: 32, y: 48 },
    Rotation::Zero,
);

pub const LT_SPICE_GROUND_PORTS: LTSpicePorts = LTSpicePorts::Ground(Position { x: 0, y: 0 });

pub const LT_SPICE_V_PS_PORTS: LTSpicePorts = LTSpicePorts::VoltagePowerSupply(
    Position { x: 0, y: 16 },
    Position { x: 0, y: 96 },
    Position { x: 0, y: 56 },
    Rotation::Zero,
);

pub const LT_SPICE_I_PS_PORTS: LTSpicePorts = LTSpicePorts::CurrentPowerSupply(
    Position { x: 0, y: 0 },
    Position { x: 0, y: 80 },
    Position { x: 0, y: 56 },
    Rotation::Zero,
);
