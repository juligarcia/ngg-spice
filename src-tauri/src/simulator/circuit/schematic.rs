use std::collections::HashSet;

use crate::simulator::{simulation::Simulation, simulator_error::SimulatorError};

use super::element::Element;

#[derive(Clone)]
pub struct Schematic {
    elements: Vec<Element>,
    ground_alias: HashSet<String>,
}

impl Schematic {
    pub fn new() -> Self {
        Self {
            elements: Vec::default(),
            ground_alias: HashSet::default(),
        }
    }

    pub fn insert(&mut self, element: Element) {
        self.elements.push(element);
    }

    pub fn insert_ground_alias(&mut self, alias: &String) {
        self.ground_alias.insert(alias.to_owned());
    }

    fn get_netlist_header() -> String {
        format!("Graphic Spice Netlist\n")
    }

    fn get_netlist_options() -> String {
        // format!("")
        format!(".options savecurrents\n")
    }

    fn get_netlist_footer() -> String {
        format!(".end\n")
    }

    pub fn build_netlist(&self, sim_config: Simulation) -> Result<String, SimulatorError> {
        let mut netlist: String = String::default();

        netlist.push_str(&Self::get_netlist_header());

        for element in &self.elements {
            let line = element.get_netlist_representation(&self.ground_alias)?;
            netlist.push_str(&line);
        }

        netlist.push_str(&Self::get_netlist_options());

        netlist.push_str(&sim_config.format());

        netlist.push_str(&Self::get_netlist_footer());

        Ok(netlist)
    }
}
