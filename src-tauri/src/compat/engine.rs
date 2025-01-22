use std::{collections::HashMap, fs::File};

use serde::Serialize;
use tauri::State;
use tauri_plugin_fs::FilePath;

use crate::app_state::AppState;

use super::{
    circuit::canvas::{CanvasEdge, CanvasNode},
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

    fn domain_to_file(
        nodes: Vec<CanvasNode>,
        edges: Vec<CanvasEdge>,
        config: HashMap<String, SimulationConfig>,
        file: File,
    ) -> Result<(), ()>;
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum SupportedPlatforms {
    GraphicSpice,
    LtSpice,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenFileEventPaylad {
    pub nodes: Vec<CanvasNode>,
    pub edges: Vec<CanvasEdge>,
    pub config: HashMap<String, SimulationConfig>,
    pub platform: SupportedPlatforms,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RequestCanvasDataEventPayload {
    pub file_path: FilePath,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ToastErrorPayload {
    pub message: String,
}
