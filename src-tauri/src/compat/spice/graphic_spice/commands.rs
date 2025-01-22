use std::{fs::File, path::PathBuf};

use tauri::{Emitter, Manager};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;

use super::engine::GraphicSpice;
use crate::{
    app_state::AppState,
    compat::{
        circuit::canvas::{CanvasEdge, CanvasNode},
        engine::{
            Engine, OpenFileEventPaylad, RequestCanvasDataEventPayload, SupportedPlatforms,
            ToastErrorPayload,
        },
        simulation::SimulationConfig,
    },
};

pub fn save_graphic_spice(app_handle: &tauri::AppHandle) {
    let inner_app_handle = app_handle.clone();

    app_handle
        .dialog()
        .file()
        .save_file(move |graphic_spice_file_path| {
            if let Some(file_path) = graphic_spice_file_path {
                inner_app_handle
                    .emit(
                        "canvas_data_request",
                        RequestCanvasDataEventPayload { file_path },
                    )
                    .unwrap();
            }
        });
}

#[tauri::command]
pub fn save_graphic_spice_from_domain(
    app_handle: tauri::AppHandle,
    nodes: Vec<CanvasNode>,
    edges: Vec<CanvasEdge>,
    config: std::collections::HashMap<String, SimulationConfig>,
    file_path: FilePath,
) {
    let mut path = PathBuf::from(file_path.as_path().unwrap());
    path.set_extension("gsp");

    let file = File::create(path).unwrap();

    if let Err(_) = GraphicSpice::domain_to_file(nodes, edges, config, file) {
        app_handle
            .emit(
                "toast_error",
                ToastErrorPayload {
                    message: "Failed to save file".to_owned(),
                },
            )
            .unwrap();
    }
}

pub fn open_graphic_spice(app_handle: &tauri::AppHandle) {
    let inner_app_handle = app_handle.clone();

    app_handle
        .dialog()
        .file()
        .add_filter("Graphic Spice filter", &["gsp"])
        .pick_file(move |graphic_spice_file_path| {
            if let Some(file_path) = graphic_spice_file_path {
                let file = File::open(file_path.as_path().unwrap()).unwrap();

                let state = inner_app_handle.state::<AppState>();

                if let Ok((nodes, edges, config)) = GraphicSpice::file_to_domain(file, state) {
                    inner_app_handle
                        .emit(
                            "open_file",
                            OpenFileEventPaylad {
                                nodes,
                                edges,
                                config,
                                platform: SupportedPlatforms::GraphicSpice,
                            },
                        )
                        .unwrap();
                }
            }
        });
}
