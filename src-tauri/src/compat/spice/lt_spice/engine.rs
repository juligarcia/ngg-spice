use std::{
    collections::{HashMap, HashSet},
    fs::File,
    io::{BufRead, BufReader},
};

use crate::{
    app_state::{models::bjt::get_bjt_model, AppState},
    common::numbers::position::Position,
    compat::{
        circuit::canvas::{CanvasEdge, CanvasNode, NodeData, SmallSignalConfig, TimeDomainConfig},
        engine::Engine,
        simulation::SimulationConfig,
    },
};

use tauri::State;
use uuid::Uuid;

use super::constants::{
    LTSpicePorts, LT_SPICE_BJT_PORTS, LT_SPICE_C_PORTS, LT_SPICE_GROUND_PORTS, LT_SPICE_I_PORTS,
    LT_SPICE_I_PS_PORTS, LT_SPICE_R_PORTS, LT_SPICE_V_PS_PORTS,
};

#[derive(Debug, Clone)]
pub enum Rotation {
    Zero,
    Ninety,
    OneEighty,
    TwoSeventy,
}

impl Rotation {
    pub fn from_number(n: i32) -> Self {
        match n {
            0 => Rotation::Zero,
            90 => Rotation::Ninety,
            180 => Rotation::OneEighty,
            270 => Rotation::TwoSeventy,
            _ => Rotation::Zero,
        }
    }

    pub fn as_number(&self) -> i32 {
        match self {
            Rotation::Zero => 0,
            Rotation::Ninety => 90,
            Rotation::OneEighty => 180,
            Rotation::TwoSeventy => 270,
        }
    }
}

#[derive(Debug, Clone)]
pub enum SymType {
    Cap,
    Res,
    Ind,
    Voltage,
    Current,
    Ground,
    Npn,
    Pnp,
    // TODO: Add more...
}

impl SymType {
    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "cap" => SymType::Cap,
            "res" => SymType::Res,
            "ind" => SymType::Ind,
            "voltage" => SymType::Voltage,
            "current" => SymType::Current,
            "npn" => SymType::Npn,
            "pnp" => SymType::Pnp,
            _ => SymType::Ground,
        }
    }
}

#[derive(Debug, Clone)]
pub struct SymTransform {
    rotation: Rotation,
    mirrored: bool,
}

impl SymTransform {
    pub fn new() -> Self {
        Self {
            rotation: Rotation::Zero,
            mirrored: false,
        }
    }

    pub fn from_str(s: &str) -> Self {
        let mut transform = SymTransform {
            rotation: Rotation::Zero,
            mirrored: false,
        };

        if s.contains("M") {
            transform.mirrored = true;
        }

        match s.replace("M", "").as_str() {
            "R0" => transform.rotation = Rotation::Zero,
            "R90" => transform.rotation = Rotation::Ninety,
            "R180" => transform.rotation = Rotation::OneEighty,
            "R270" => transform.rotation = Rotation::TwoSeventy,
            _ => {}
        }

        transform
    }
}

/*

For Spice reference:

<name> node1 node2 [...] <SpiceModel>
+ <Value> <Value2> <SpiceLine> <SpiceLine2>

*/
#[derive(Debug, Clone)]
pub enum SymbolAttribute {
    InstName(String),
    SpiceModel(String),
    Value(String),
    Value2(String),
    SpiceLine(String),
    SpiceLine2(String),
}

impl SymbolAttribute {
    pub fn from_str(s: &str) -> Option<Self> {
        let attribute = s.replace("SYMATTR ", "");

        if let Some((name, value)) = attribute.split_once(" ") {
            match name {
                "InstName" => {
                    return Some(SymbolAttribute::InstName(value.to_string()));
                }
                "SpiceModel" => {
                    return Some(SymbolAttribute::SpiceModel(value.to_string()));
                }
                "Value" => {
                    return Some(SymbolAttribute::Value(value.to_string()));
                }
                "Value2" => {
                    return Some(SymbolAttribute::Value2(value.to_string()));
                }
                "SpiceLine" => {
                    return Some(SymbolAttribute::SpiceLine(value.to_string()));
                }
                "SpiceLine2" => {
                    return Some(SymbolAttribute::SpiceLine2(value.to_string()));
                }
                _ => {
                    return None;
                }
            }
        }

        None
    }
}

#[derive(Debug, Clone)]
pub enum Directives {
    Wire {
        id: Uuid,
        start: Position,
        end: Position,
    },
    Flag {
        position: Position,
        name: String,
    },
    Symbol {
        id: Uuid,
        position: Position,
        symbol: SymType,
        attributes: Vec<SymbolAttribute>,
        transform: SymTransform,
    },
    Text {
        content: String,
    },
}

pub struct ConnectionTracker {
    connections: HashMap<Uuid, HashSet<Uuid>>,
}

impl ConnectionTracker {
    pub fn new() -> Self {
        Self {
            connections: HashMap::<Uuid, HashSet<Uuid>>::default(),
        }
    }

    pub fn contains(&self, source: &Uuid, target: &Uuid) -> bool {
        if let Some(connections) = self.connections.get(source) {
            return connections.contains(target);
        }

        false
    }

    pub fn add(&mut self, source: Uuid, target: Uuid) {
        if let Some(connections) = self.connections.get_mut(&source) {
            connections.insert(target.clone());
        } else {
            let mut new_connections = HashSet::<Uuid>::default();
            new_connections.insert(target);
            self.connections.insert(source, new_connections);
        }

        if let Some(connections) = self.connections.get_mut(&target) {
            connections.insert(source.clone());
        } else {
            let mut new_connections = HashSet::<Uuid>::default();
            new_connections.insert(source);
            self.connections.insert(target, new_connections);
        }
    }
}

#[derive(Debug, Clone)]
pub struct NodeMapper {}

impl NodeMapper {
    fn from_directives(
        directives: Vec<Directives>,
        state: State<AppState>,
    ) -> (Vec<CanvasNode>, Vec<CanvasEdge>) {
        let bjt_models = &state.bjt_models;

        // To avoid creating a double edge
        let mut connection_tracker = ConnectionTracker::new();

        // Get all symbols
        let symbols: Vec<Directives> = directives
            .iter()
            .filter(|directive| match directive {
                Directives::Symbol { .. } => true,
                _ => false,
            })
            .map(|directive| directive.clone())
            .collect();

        let wires: Vec<Directives> = directives
            .iter()
            .filter(|directive| match directive {
                Directives::Wire { .. } => true,
                _ => false,
            })
            .map(|directive| directive.clone())
            .collect();

        // Might still need to remove some floating nodes
        // let mut ports_that_are_not_nodes = HashSet::<String>::default();

        let mut nodes = Vec::<CanvasNode>::default();
        let mut edges = Vec::<CanvasEdge>::default();

        for symbol in &symbols {
            match symbol {
                Directives::Symbol {
                    id,
                    position,
                    symbol,
                    attributes,
                    transform,
                } => match symbol {
                    SymType::Res => {
                        if let LTSpicePorts::Resistor(_, _, offset, rotation) = LT_SPICE_R_PORTS {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            let value: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(value)) = (name, value) {
                                let total_rotation =
                                    rotation.as_number() + transform.rotation.as_number();

                                nodes.push(CanvasNode {
                                    rotation: total_rotation,
                                    id: id.to_string(),
                                    data: NodeData::R {
                                        value,
                                        name,
                                        position: position.add(offset.rotate(
                                            &Rotation::from_number(transform.rotation.as_number()),
                                        )),
                                    },
                                });
                            }
                        }
                    }
                    SymType::Cap => {
                        if let LTSpicePorts::Capacitor(_, _, offset, rotation) = LT_SPICE_C_PORTS {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            let value: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(value)) = (name, value) {
                                nodes.push(CanvasNode {
                                    rotation: rotation.as_number() + transform.rotation.as_number(),
                                    id: id.to_string(),
                                    data: NodeData::C {
                                        value,
                                        name,
                                        position: position.add(offset.rotate(
                                            &Rotation::from_number(transform.rotation.as_number()),
                                        )),
                                    },
                                });
                            }
                        }
                    }
                    SymType::Ind => {
                        if let LTSpicePorts::Inductor(_, _, offset, rotation) = LT_SPICE_I_PORTS {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            let value: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(value)) = (name, value) {
                                nodes.push(CanvasNode {
                                    rotation: rotation.as_number() + transform.rotation.as_number(),
                                    id: id.to_string(),
                                    data: NodeData::L {
                                        value,
                                        name,
                                        position: position.add(offset.rotate(
                                            &Rotation::from_number(transform.rotation.as_number()),
                                        )),
                                    },
                                });
                            }
                        }
                    }
                    SymType::Voltage => {
                        if let LTSpicePorts::VoltagePowerSupply(_, _, offset, rotation) =
                            LT_SPICE_V_PS_PORTS
                        {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            // Required
                            let time_domain: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            // Optional
                            let small_signal: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value2(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(time_domain)) = (name, time_domain) {
                                nodes.push(CanvasNode {
                                    rotation: rotation.as_number() + transform.rotation.as_number(),
                                    id: id.to_string(),
                                    data: NodeData::V {
                                        name,
                                        time_domain: TimeDomainConfig::from_string(&time_domain),
                                        small_signal: small_signal.map(|small_signal| {
                                            SmallSignalConfig::from_string(&small_signal)
                                        }),
                                        position: position.add(offset.rotate(
                                            &Rotation::from_number(transform.rotation.as_number()),
                                        )),
                                    },
                                });
                            }
                        }
                    }

                    SymType::Current => {
                        if let LTSpicePorts::CurrentPowerSupply(_, _, offset, rotation) =
                            LT_SPICE_I_PS_PORTS
                        {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            // Required
                            let time_domain: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            // Optional
                            let small_signal: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value2(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(time_domain)) = (name, time_domain) {
                                nodes.push(CanvasNode {
                                    rotation: rotation.as_number() + transform.rotation.as_number(),
                                    id: id.to_string(),
                                    data: NodeData::I {
                                        name,
                                        time_domain: TimeDomainConfig::from_string(&time_domain),
                                        small_signal: small_signal.map(|small_signal| {
                                            SmallSignalConfig::from_string(&small_signal)
                                        }),
                                        position: position.add(offset.rotate(
                                            &Rotation::from_number(transform.rotation.as_number()),
                                        )),
                                    },
                                });
                            }
                        }
                    }

                    SymType::Npn => {
                        if let LTSpicePorts::Bjt(_, _, _, offset, rotation) = LT_SPICE_BJT_PORTS {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            // For transistors, value is just the name of the model
                            let value: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(value)) = (name, value) {
                                if let Ok(Some(model)) = get_bjt_model(&value, bjt_models) {
                                    nodes.push(CanvasNode {
                                        rotation: rotation.as_number()
                                            + transform.rotation.as_number(),
                                        id: id.to_string(),
                                        data: NodeData::Q {
                                            name,
                                            model: model.to_canvas(),
                                            position: position.add(offset.rotate(
                                                &Rotation::from_number(
                                                    transform.rotation.as_number(),
                                                ),
                                            )),
                                        },
                                    });
                                }
                            }
                        }
                    }

                    SymType::Pnp => {
                        if let LTSpicePorts::Bjt(_, _, _, offset, rotation) = LT_SPICE_BJT_PORTS {
                            let name: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::InstName(instance_name) => {
                                        Some(instance_name.to_string())
                                    }
                                    _ => None,
                                });

                            // For transistors, value is just the name of the model
                            let value: Option<String> =
                                attributes.iter().find_map(|attr| match attr {
                                    SymbolAttribute::Value(value) => Some(value.to_string()),
                                    _ => None,
                                });

                            if let (Some(name), Some(value)) = (name, value) {
                                if let Ok(Some(model)) = get_bjt_model(&value, bjt_models) {
                                    nodes.push(CanvasNode {
                                        rotation: rotation.as_number()
                                            + transform.rotation.as_number(),
                                        id: id.to_string(),
                                        data: NodeData::Q {
                                            name,
                                            model: model.to_canvas(),
                                            position: position.add(offset.rotate(
                                                &Rotation::from_number(
                                                    transform.rotation.as_number(),
                                                ),
                                            )),
                                        },
                                    });
                                }
                            }
                        }
                    }

                    SymType::Ground => {
                        nodes.push(CanvasNode {
                            rotation: 0,
                            id: id.to_string(),
                            data: NodeData::Gnd {
                                position: position.clone(),
                            },
                        });
                    }
                    _ => {}
                },
                _ => {}
            }
        }

        // Treat each wire as a node
        for directive in &directives {
            match directive {
                Directives::Wire {
                    start,
                    end,
                    id: node_id,
                } => {
                    // Push wire as a node
                    nodes.push(CanvasNode {
                        rotation: 0,
                        id: node_id.to_string(),
                        data: NodeData::Node {
                            name: format!("Node{}", nodes.len()),
                            position: Position::average(start, end).add(Position { x: 5, y: 5 }),
                        },
                    });

                    for symbol in &symbols {
                        match symbol {
                            Directives::Symbol {
                                position,
                                symbol,
                                id: symbol_id,
                                transform,
                                ..
                            } => {
                                match symbol {
                                    SymType::Res => {
                                        if let LTSpicePorts::Resistor(port0, port1, _, _) =
                                            LT_SPICE_R_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Cap => {
                                        if let LTSpicePorts::Capacitor(port0, port1, _, _) =
                                            LT_SPICE_C_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Ind => {
                                        if let LTSpicePorts::Inductor(port0, port1, _, _) =
                                            LT_SPICE_I_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Voltage => {
                                        if let LTSpicePorts::VoltagePowerSupply(
                                            port0,
                                            port1,
                                            _,
                                            _,
                                        ) = LT_SPICE_V_PS_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Current => {
                                        if let LTSpicePorts::CurrentPowerSupply(
                                            port0,
                                            port1,
                                            _,
                                            _,
                                        ) = LT_SPICE_I_PS_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Ground => {
                                        if let LTSpicePorts::Ground(port0) = LT_SPICE_GROUND_PORTS {
                                            let relative_port0 = port0.add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                    SymType::Npn => {
                                        if let LTSpicePorts::Bjt(port0, port1, port2, _, _) =
                                            LT_SPICE_BJT_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);
                                            let relative_port2 =
                                                port2.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port2)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-2", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }

                                    SymType::Pnp => {
                                        if let LTSpicePorts::Bjt(port0, port1, port2, _, _) =
                                            LT_SPICE_BJT_PORTS
                                        {
                                            let relative_port0 =
                                                port0.rotate(&transform.rotation).add(*position);
                                            let relative_port1 =
                                                port1.rotate(&transform.rotation).add(*position);
                                            let relative_port2 =
                                                port2.rotate(&transform.rotation).add(*position);

                                            if Position::is_between(start, end, relative_port0)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-0", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port1)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-1", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }

                                            if Position::is_between(start, end, relative_port2)
                                                && !connection_tracker.contains(symbol_id, node_id)
                                            {
                                                // Assign target as the wire's node representation
                                                connection_tracker
                                                    .add(node_id.clone(), symbol_id.clone());
                                                edges.push(CanvasEdge {
                                                    target: node_id.to_string(),
                                                    source: symbol_id.to_string(),
                                                    source_port: format!("port-[{}]-2", symbol_id),
                                                    target_port: Some(format!(
                                                        "port-[{}]-0",
                                                        node_id
                                                    )),
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                            _ => {}
                        }
                    }

                    // Wires not connected to elements should be connected to adjacent wires
                    for wire in &wires {
                        match wire {
                            Directives::Wire {
                                start: wire_start,
                                end: wire_end,
                                id: wire_id,
                            } => {
                                // If it's the same wire, skip
                                if wire_id.eq(node_id) {
                                    continue;
                                }

                                if Position::is_between(wire_start, wire_end, start.clone())
                                    && !connection_tracker.contains(node_id, wire_id)
                                {
                                    connection_tracker.add(*node_id, *wire_id);
                                    edges.push(CanvasEdge {
                                        target: node_id.to_string(),
                                        source: wire_id.to_string(),
                                        source_port: format!("port-[{}]-0", wire_id),
                                        target_port: Some(format!("port-[{}]-0", node_id)),
                                    });
                                    continue;
                                }

                                if Position::is_between(wire_start, wire_end, end.clone())
                                    && !connection_tracker.contains(node_id, wire_id)
                                {
                                    connection_tracker.add(*node_id, *wire_id);
                                    edges.push(CanvasEdge {
                                        target: node_id.to_string(),
                                        source: wire_id.to_string(),
                                        source_port: format!("port-[{}]-0", wire_id),
                                        target_port: Some(format!("port-[{}]-0", node_id)),
                                    });
                                    continue;
                                }
                            }
                            _ => {}
                        }
                    }
                }
                _ => {}
            }
        }

        // TODO: Parse simulations

        (nodes, edges)
    }
}

pub struct LTSpice {}

impl LTSpice {
    pub fn parse_directives(file: File) -> Result<Vec<Directives>, ()> {
        let reader = BufReader::new(file);

        let mut directives = Vec::<Directives>::default();

        for line in reader.lines() {
            if let Ok(line) = line {
                match line {
                    flag if line.starts_with("FLAG") => {
                        let trimmed = flag.replace("FLAG ", "");

                        if let [x, y, name] =
                            trimmed.split_whitespace().collect::<Vec<&str>>()[0..3]
                        {
                            if name == "0" {
                                directives.push(Directives::Symbol {
                                    position: Position {
                                        x: x.parse().unwrap(),
                                        y: y.parse().unwrap(),
                                    },
                                    symbol: SymType::Ground,
                                    attributes: Vec::default(),
                                    transform: SymTransform::new(),
                                    id: Uuid::new_v4(),
                                });
                            } else {
                                directives.push(Directives::Flag {
                                    position: Position {
                                        x: x.parse().unwrap(),
                                        y: y.parse().unwrap(),
                                    },
                                    name: name.to_string(),
                                });
                            }
                        } else {
                            return Err(());
                        }
                    }

                    wire if line.starts_with("WIRE ") => {
                        let trimmed = wire.replace("WIRE ", "");

                        if let [x1, y1, x2, y2] =
                            trimmed.split_whitespace().collect::<Vec<&str>>()[0..4]
                        {
                            directives.push(Directives::Wire {
                                id: Uuid::new_v4(),
                                start: Position {
                                    x: x1.parse().unwrap(),
                                    y: y1.parse().unwrap(),
                                },
                                end: Position {
                                    x: x2.parse().unwrap(),
                                    y: y2.parse().unwrap(),
                                },
                            });
                        } else {
                            return Err(());
                        }
                    }

                    symbol if line.starts_with("SYMBOL") => {
                        let trimmed = symbol.replace("SYMBOL ", "");

                        if let [symbol, x, y, transform] =
                            trimmed.split_whitespace().collect::<Vec<&str>>()[0..4]
                        {
                            let symbol_directive = Directives::Symbol {
                                id: Uuid::new_v4(),
                                position: Position {
                                    x: x.parse().unwrap(),
                                    y: y.parse().unwrap(),
                                },
                                symbol: SymType::from_str(symbol),
                                attributes: Vec::default(),
                                transform: SymTransform::from_str(transform),
                            };

                            directives.push(symbol_directive);
                        } else {
                            return Err(());
                        }
                    }

                    symattr if line.starts_with("SYMATTR") => {
                        if let Some(attribute) = SymbolAttribute::from_str(&symattr) {
                            let symbol = directives.last_mut().unwrap();

                            match symbol {
                                Directives::Symbol { attributes, .. } => {
                                    attributes.push(attribute);
                                }
                                _ => {
                                    return Err(());
                                }
                            }
                        }
                    }

                    text if line.starts_with("TEXT") => {
                        let content = text.replace("TEXT ", "");
                        directives.push(Directives::Text { content });
                    }

                    _ => {
                        // Skip lines that are not of value
                        continue;
                    }
                }
            }
        }

        Ok(directives)
    }
}

impl Engine for LTSpice {
    fn file_to_domain(
        file: File,
        state: State<AppState>,
    ) -> Result<
        (
            Vec<CanvasNode>,
            Vec<CanvasEdge>,
            HashMap<String, SimulationConfig>,
        ),
        (),
    > {
        let config = HashMap::<String, SimulationConfig>::default();

        let directives = LTSpice::parse_directives(file)?;

        let (nodes, edges) = NodeMapper::from_directives(directives, state);

        Ok((nodes, edges, config))
    }
}
