use std::{collections::HashMap, fs::File};

use serde::Serialize;
use tauri::State;

use crate::app_state::AppState;

use super::{
    circuit::{
        canvas::{CanvasEdge, CanvasNode},
        schematic::Schematic,
    },
    simulation::SimulationConfig,
};

/*
    nodes: Vec<CanvasNode>,
    edges: Vec<CanvasEdge>,
    config: HashMap<String, SimulationConfig>,
*/
pub trait Engine {
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
    >;
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenFileEventPaylad {
    pub nodes: Vec<CanvasNode>,
    pub edges: Vec<CanvasEdge>,
    pub config: HashMap<String, SimulationConfig>,
}
