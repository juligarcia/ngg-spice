use std::collections::HashSet;

use crate::simulator::{
    simulator_error::SimulatorError,
    unit_of_magnitude::UnitOfMagnitude as Unit,
    units::{Capacitance, Inductance, Resistance, Voltage},
};

#[derive(Clone)]
pub enum Element {
    R(String, Unit<Resistance>, String, String),
    C(String, Unit<Capacitance>, String, String),
    L(String, Unit<Inductance>, String, String),
    V(String, Unit<Voltage>, String, String),
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

            Element::V(name, value, node1, node2) => {
                if let [n1, n2] = &Self::replace_ground_alias(&[node1, node2], ground_alias)[0..2] {
                    return Ok(format!("V{} {} {} {}\n", name, n1, n2, value.format()));
                }

                Err(SimulatorError::ElementParserError(name.to_owned()))
            }
        }
    }
}
