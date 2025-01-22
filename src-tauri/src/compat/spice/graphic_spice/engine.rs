use std::{
    collections::HashMap,
    fmt::Display,
    fs::File,
    io::{BufRead, BufReader, Write},
};

use tauri::State;

use crate::{
    app_state::{models::bjt::get_bjt_model, AppState},
    common::numbers::position::Position,
    compat::{
        circuit::canvas::{CanvasEdge, CanvasNode, NodeData, SmallSignalConfig, TimeDomainConfig},
        engine::Engine,
        simulation::SimulationConfig,
    },
};

pub enum Rotation {
    R0,
    R90,
    R180,
    R270,
}

impl Display for Rotation {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", Rotation::to_string(self))
    }
}

impl Rotation {
    pub fn from_string(value: &str) -> Rotation {
        match value {
            "R0" => Rotation::R0,
            "R90" => Rotation::R90,
            "R180" => Rotation::R180,
            "R270" => Rotation::R270,
            _ => Rotation::R0,
        }
    }

    pub fn from_number(value: i32) -> Rotation {
        match value {
            0 => Rotation::R0,
            90 => Rotation::R90,
            180 => Rotation::R180,
            270 => Rotation::R270,
            _ => Rotation::R0,
        }
    }

    pub fn to_string(&self) -> String {
        match self {
            Rotation::R0 => "R0".to_owned(),
            Rotation::R90 => "R90".to_owned(),
            Rotation::R180 => "R180".to_owned(),
            Rotation::R270 => "R270".to_owned(),
        }
    }

    pub fn from_number_to_string(value: i32) -> String {
        match value {
            0 => "R0".to_owned(),
            90 => "R90".to_owned(),
            180 => "R180".to_owned(),
            270 => "R270".to_owned(),
            _ => "R0".to_owned(),
        }
    }

    pub fn to_number(&self) -> i32 {
        match self {
            Rotation::R0 => 0,
            Rotation::R90 => 90,
            Rotation::R180 => 180,
            Rotation::R270 => 270,
        }
    }
}

pub enum InstanceName {
    R,
    C,
    L,
    V,
    I,
    Q,
    // TODO: add more components
}

impl InstanceName {
    pub fn to_string(&self) -> String {
        match self {
            InstanceName::R => "R".to_owned(),
            InstanceName::C => "C".to_owned(),
            InstanceName::L => "L".to_owned(),
            InstanceName::V => "V".to_owned(),
            InstanceName::I => "I".to_owned(),
            InstanceName::Q => "Q".to_owned(),
        }
    }
}

impl InstanceName {
    pub fn from_string(value: &str) -> Option<InstanceName> {
        match value {
            "R" => Some(InstanceName::R),
            "C" => Some(InstanceName::C),
            "L" => Some(InstanceName::L),
            "V" => Some(InstanceName::V),
            "I" => Some(InstanceName::I),
            "Q" => Some(InstanceName::Q),
            _ => None,
        }
    }
}

pub enum Directives {
    Connection {
        source_node: String,
        source_port: String,
        target_node: String,
        target_port: String,
        target_alias: Option<String>,
    },

    Node {
        id: String,
        position: Position,
        tag: String,
    },

    Symbol {
        id: String,
        name: String,
        instance_name: InstanceName,
        rotation: Rotation,
        position: Position,
        value: Option<String>,
    },

    Ground {
        id: String,
        position: Position,
    },

    SimConfig {
        id: String,
        config: SimulationConfig,
    },
}

pub struct GraphicSpice {}

impl GraphicSpice {
    pub fn write_directives_to_file(
        directives: Vec<Directives>,
        file: File,
    ) -> Result<(), std::io::Error> {
        let mut writer = std::io::BufWriter::new(file);

        for (i, directive) in directives.iter().enumerate() {
            match directive {
                Directives::Connection {
                    source_node,
                    source_port,
                    target_node,
                    target_port,
                    target_alias,
                } => {
                    writer.write_all(
                        format!(
                            "CONNECTION {} {} {} {} {}\n",
                            source_node,
                            source_port,
                            target_node,
                            target_port,
                            target_alias.to_owned().unwrap_or(format!("Node{}", i))
                        )
                        .as_bytes(),
                    )?;
                }

                Directives::Node { id, position, tag } => {
                    writer.write_all(
                        format!("NODE {} {} {} {}\n", id, position.x, position.y, tag).as_bytes(),
                    )?;
                }

                Directives::Ground { id, position } => {
                    writer.write_all(
                        format!("GND {} {} {}\n", id, position.x, position.y,).as_bytes(),
                    )?;
                }

                Directives::Symbol {
                    id,
                    name,
                    instance_name,
                    rotation,
                    position,
                    value,
                } => {
                    writer.write_all(
                        format!(
                            "SYMBOL {} {} {} {} {} {} {}\n",
                            instance_name.to_string(),
                            name.to_owned(),
                            id,
                            rotation.to_owned(),
                            position.x,
                            position.y,
                            value.to_owned().unwrap_or("NS".to_owned())
                        )
                        .as_bytes(),
                    )?;
                }

                Directives::SimConfig { id, config } => {
                    writer.write_all(
                        format!("SIM {} {}\n", id, config.values_to_string()).as_bytes(),
                    )?;
                }
            }
        }

        Ok(())
    }

    pub fn domain_to_directives(
        nodes: Vec<CanvasNode>,
        edges: Vec<CanvasEdge>,
        config: HashMap<String, SimulationConfig>,
    ) -> Vec<Directives> {
        let mut directives = Vec::<Directives>::default();

        for node in nodes {
            match node.data {
                NodeData::Node { name, position } => {
                    directives.push(Directives::Node {
                        id: node.id.clone(),
                        position,
                        tag: name,
                    });
                }

                NodeData::R {
                    name,
                    value,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::R,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value,
                    });
                }

                NodeData::C {
                    name,
                    value,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::C,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value,
                    });
                }

                NodeData::L {
                    name,
                    value,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::L,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value,
                    });
                }

                NodeData::V {
                    name,
                    time_domain,
                    small_signal,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::V,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value: Some(format!(
                            "({}, {})",
                            time_domain
                                .map(|time_domain| time_domain.to_gsp_string())
                                .unwrap_or_default(),
                            small_signal
                                .map(|small_signal| small_signal.to_gsp_string())
                                .unwrap_or_default()
                        )),
                    });
                }

                NodeData::I {
                    name,
                    time_domain,
                    small_signal,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::I,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value: Some(format!(
                            "({}, {})",
                            time_domain
                                .map(|time_domain| time_domain.to_gsp_string())
                                .unwrap_or_default(),
                            small_signal
                                .map(|small_signal| small_signal.to_gsp_string())
                                .unwrap_or_default()
                        )),
                    });
                }

                NodeData::Q {
                    name,
                    model,
                    position,
                } => {
                    directives.push(Directives::Symbol {
                        id: node.id.clone(),
                        name,
                        instance_name: InstanceName::Q,
                        rotation: Rotation::from_number(node.rotation),
                        position,
                        value: Some(model.map(|model| model.name).unwrap_or_default()),
                    });
                }

                NodeData::Gnd { position } => {
                    directives.push(Directives::Ground {
                        id: node.id.clone(),
                        position,
                    });
                }

                _ => {
                    // TODO: add more
                    continue;
                }
            }
        }

        for edge in edges {
            directives.push(Directives::Connection {
                source_node: edge.source,
                source_port: edge.source_port,
                target_node: edge.target,
                target_port: edge.target_port,
                target_alias: edge.target_alias,
            });
        }

        for (id, config) in config {
            directives.push(Directives::SimConfig {
                id: id.to_owned(),
                config,
            });
        }

        directives
    }

    pub fn parse_directives(file: File) -> Result<Vec<Directives>, ()> {
        let reader = BufReader::new(file);

        let mut directives = Vec::<Directives>::default();

        for line in reader.lines() {
            if let Ok(line) = line {
                match line {
                    connection if line.starts_with("CONNECTION") => {
                        let trimmed = connection.replace("CONNECTION ", "");

                        let mut split = trimmed.split_whitespace();

                        // if let [source_node, source_port, target_node, target_port] =
                        //     trimmed.split_whitespace().collect::<Vec<&str>>()[0..4]
                        // {

                        directives.push(Directives::Connection {
                            source_node: split.next().unwrap().to_owned(),
                            source_port: split.next().unwrap().to_owned(),
                            target_node: split.next().unwrap().to_owned(),
                            target_port: split.next().unwrap().to_owned(),
                            target_alias: split.next().map(|maybe_alias| maybe_alias.to_owned()),
                        });
                    }

                    node if line.starts_with("NODE ") => {
                        let trimmed = node.replace("NODE ", "");

                        if let [id, x, y, tag] =
                            trimmed.split_whitespace().collect::<Vec<&str>>()[0..4]
                        {
                            directives.push(Directives::Node {
                                id: id.to_owned(),
                                position: Position {
                                    x: x.parse().unwrap(),
                                    y: y.parse().unwrap(),
                                },
                                tag: tag.to_owned(),
                            });
                        } else {
                            return Err(());
                        }
                    }

                    symbol if line.starts_with("SYMBOL") => {
                        let params = symbol.replace("SYMBOL ", "");

                        let value_split = params
                            .split_whitespace()
                            .collect::<Vec<&str>>()
                            .split_off(6);

                        let value = value_split.join(" ");

                        if let [instance_name, tag, id, rotation, x, y] =
                            params.split_whitespace().collect::<Vec<&str>>()[0..6]
                        {
                            let symbol_directive = Directives::Symbol {
                                instance_name: InstanceName::from_string(instance_name).unwrap(),
                                name: tag.to_owned(),
                                id: id.to_owned(),
                                position: Position {
                                    x: x.parse().unwrap(),
                                    y: y.parse().unwrap(),
                                },
                                rotation: Rotation::from_string(rotation),
                                value: if value == "NS" {
                                    None
                                } else {
                                    Some(value.to_owned())
                                },
                            };

                            directives.push(symbol_directive);
                        } else {
                            return Err(());
                        }
                    }

                    gnd if line.starts_with("GND") => {
                        let trimmed = gnd.replace("GND ", "");

                        if let [id, x, y] = trimmed.split_whitespace().collect::<Vec<&str>>()[0..3]
                        {
                            directives.push(Directives::Ground {
                                id: id.to_owned(),
                                position: Position {
                                    x: x.parse().unwrap(),
                                    y: y.parse().unwrap(),
                                },
                            });
                        } else {
                            return Err(());
                        }
                    }

                    simconfig if line.starts_with("SIM") => {
                        let trimmed = simconfig.replace("SIM ", "");

                        if let Some((id, config)) = trimmed.split_once(" ") {
                            if let Some((kind, config)) = config.split_once(" ") {
                                let simconfig_directive = Directives::SimConfig {
                                    id: id.to_owned(),
                                    config: SimulationConfig::from_tuple((kind, config)).unwrap(),
                                };

                                directives.push(simconfig_directive);
                            }
                        } else {
                            return Err(());
                        }
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

pub struct NodeMapper {}

impl NodeMapper {
    fn from_directives(
        directives: Vec<Directives>,
        state: State<AppState>,
    ) -> (
        Vec<CanvasNode>,
        Vec<CanvasEdge>,
        HashMap<String, SimulationConfig>,
    ) {
        let mut nodes = Vec::<CanvasNode>::default();
        let mut edges = Vec::<CanvasEdge>::default();
        let mut config_map = HashMap::<String, SimulationConfig>::default();

        let bjt_models = &state.bjt_models;

        for directive in directives {
            match directive {
                Directives::Node { id, position, tag } => {
                    let node = CanvasNode {
                        id: id.to_string(),
                        rotation: 0,
                        data: NodeData::Node {
                            name: tag,
                            position,
                        },
                    };

                    nodes.push(node);
                }

                Directives::Ground { id, position } => {
                    let node = CanvasNode {
                        id: id.to_string(),
                        rotation: 0,
                        data: NodeData::Gnd { position },
                    };

                    nodes.push(node);
                }

                Directives::Symbol {
                    id,
                    instance_name,
                    rotation,
                    position,
                    value,
                    name,
                } => match instance_name {
                    InstanceName::R => {
                        let node = CanvasNode {
                            id: id.to_string(),
                            rotation: rotation.to_number(),
                            data: NodeData::R {
                                name,
                                value,
                                position,
                            },
                        };

                        nodes.push(node);
                    }

                    InstanceName::C => {
                        let node = CanvasNode {
                            id: id.to_string(),
                            rotation: rotation.to_number(),
                            data: NodeData::C {
                                name,
                                value,
                                position,
                            },
                        };

                        nodes.push(node);
                    }

                    InstanceName::L => {
                        let node = CanvasNode {
                            id: id.to_string(),
                            rotation: rotation.to_number(),
                            data: NodeData::L {
                                name,
                                value,
                                position,
                            },
                        };

                        nodes.push(node);
                    }

                    InstanceName::V => {
                        if let Some(value) = value {
                            if let Some((first_half, second_half)) = value.split_once(", ") {
                                let maybe_time_domain = first_half.replace("(", "");
                                let maybe_small_signal = second_half.replace(")", "");

                                let node = CanvasNode {
                                    id: id.to_string(),
                                    rotation: rotation.to_number(),
                                    data: NodeData::V {
                                        name,
                                        time_domain: TimeDomainConfig::from_gsp_value_string(
                                            &maybe_time_domain,
                                        ),
                                        small_signal: SmallSignalConfig::from_gsp_value_string(
                                            &maybe_small_signal,
                                        ),
                                        position,
                                    },
                                };

                                nodes.push(node);
                            }
                        }
                    }

                    InstanceName::I => {
                        if let Some(value) = value {
                            if let Some((first_half, second_half)) = value.split_once(", ") {
                                let maybe_time_domain = first_half.replace("(", "");
                                let maybe_small_signal = second_half.replace(")", "");

                                let node = CanvasNode {
                                    id: id.to_string(),
                                    rotation: rotation.to_number(),
                                    data: NodeData::I {
                                        name,
                                        time_domain: TimeDomainConfig::from_gsp_value_string(
                                            &maybe_time_domain,
                                        ),
                                        small_signal: SmallSignalConfig::from_gsp_value_string(
                                            &maybe_small_signal,
                                        ),
                                        position,
                                    },
                                };

                                nodes.push(node);
                            }
                        }
                    }

                    InstanceName::Q => {
                        if let Some(value) = value {
                            if let Ok(bjt_model_option) = get_bjt_model(&value, bjt_models) {
                                let node = CanvasNode {
                                    id: id.to_string(),
                                    rotation: rotation.to_number(),
                                    data: NodeData::Q {
                                        name,
                                        model: bjt_model_option
                                            .map(|bjt_model| bjt_model.to_canvas()),
                                        position,
                                    },
                                };

                                nodes.push(node);
                            }
                        }
                    }
                },

                Directives::Connection {
                    source_node: source,
                    source_port,
                    target_node: target,
                    target_port,
                    target_alias,
                } => {
                    let edge = CanvasEdge {
                        source,
                        source_port,
                        target,
                        target_port,
                        target_alias,
                    };

                    edges.push(edge);
                }

                Directives::SimConfig { id, config } => {
                    config_map.insert(id.to_string(), config);
                }

                _ => {
                    // Skip directives that are not of value
                    continue;
                }
            }
        }

        (nodes, edges, config_map)
    }
}

impl Engine for GraphicSpice {
    fn file_to_domain(
        file: std::fs::File,
        state: tauri::State<crate::app_state::AppState>,
    ) -> Result<
        (
            Vec<CanvasNode>,
            Vec<CanvasEdge>,
            HashMap<String, SimulationConfig>,
        ),
        (),
    > {
        let directives = GraphicSpice::parse_directives(file)?;

        let (nodes, edges, config) = NodeMapper::from_directives(directives, state);

        Ok((nodes, edges, config))
    }

    fn domain_to_file(
        nodes: Vec<CanvasNode>,
        edges: Vec<CanvasEdge>,
        config: HashMap<String, SimulationConfig>,
        file: File,
    ) -> Result<(), ()> {
        let directives = GraphicSpice::domain_to_directives(nodes, edges, config);

        GraphicSpice::write_directives_to_file(directives, file).unwrap();

        Ok(())
    }
}
