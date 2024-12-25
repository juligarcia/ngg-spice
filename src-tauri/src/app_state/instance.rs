use std::time::Instant;

use tauri_plugin_fs::FilePath;

use super::simulator::circuit::canvas::CanvasData;

#[derive(Clone)]
pub enum InstanceState {
    NotSaved,
    Saved {
        last_saved_to_file: Instant,
        path: FilePath,
        last_saved_to_state: Option<Instant>,
        canvas_data: Option<CanvasData>,
    },
}

impl InstanceState {
    pub fn get_path(&self) -> Option<&FilePath> {
        match self {
            InstanceState::NotSaved => None,
            InstanceState::Saved { path, .. } => Some(path),
        }
    }

    pub fn get_canvas_data(&self) -> Option<&CanvasData> {
        match self {
            InstanceState::NotSaved => None,
            InstanceState::Saved { canvas_data, .. } => canvas_data.as_ref(),
        }
    }
}
