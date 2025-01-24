use std::{fs::File, path::PathBuf, time::Instant};

use tauri::{Emitter, Manager, State};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_fs::FilePath;

use super::engine::GraphicSpice;
use crate::{
    app_state::{instance::InstanceState, AppState},
    compat::{
        circuit::canvas::{CanvasEdge, CanvasNode},
        engine::{
            Engine, OpenFileEventPaylad, RequestCanvasDataEventPayload, SupportedPlatforms,
            ToastErrorPayload,
        },
        simulation::SimulationConfig,
    },
};

pub fn save_graphic_spice(app_handle: &tauri::AppHandle, file_path: Option<PathBuf>) {
    let inner_app_handle = app_handle.clone();

    if let Some(file_path) = file_path {
        let app_state: State<AppState> = app_handle.state();
        let mut instance_state_guard = app_state.instance_state.lock().unwrap();

        if app_handle
            .emit(
                "canvas_data_request",
                RequestCanvasDataEventPayload {
                    file_path: file_path.clone(),
                },
            )
            .is_ok()
        {
            *instance_state_guard = InstanceState::Saved {
                last_modified: Instant::now(),
                path: file_path.clone(),
            }
        } else {
            *instance_state_guard = InstanceState::FailedToSave {
                last_modified: Instant::now(),
                path: file_path.clone(),
            }
        }

        drop(instance_state_guard);
    } else {
        app_handle
            .dialog()
            .file()
            .save_file(move |graphic_spice_file_path| {
                let app_state: State<AppState> = inner_app_handle.state();
                let mut instance_state_guard = app_state.instance_state.lock().unwrap();

                if let Some(file_path) = graphic_spice_file_path {
                    let mut file_path = PathBuf::from(file_path.as_path().unwrap());
                    file_path.set_extension("gsp");

                    if inner_app_handle
                        .emit(
                            "canvas_data_request",
                            RequestCanvasDataEventPayload {
                                file_path: file_path.clone(),
                            },
                        )
                        .is_ok()
                    {
                        *instance_state_guard = InstanceState::Saved {
                            last_modified: Instant::now(),
                            path: file_path.clone(),
                        }
                    } else {
                        *instance_state_guard = InstanceState::FailedToSave {
                            last_modified: Instant::now(),
                            path: file_path.clone(),
                        }
                    }
                }

                drop(instance_state_guard);
            });
    }
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
            let app_state: State<AppState> = inner_app_handle.state();
            let mut instance_state_guard = app_state.instance_state.lock().unwrap();

            if let Some(file_path) = graphic_spice_file_path {
                let file = File::open(file_path.as_path().unwrap()).unwrap();
                let last_modified = if let Ok(metadata) = file.metadata() {
                    if let Ok(modified_time) = metadata.modified() {
                        if let Ok(elapsed) = modified_time.elapsed() {
                            Instant::now() - elapsed
                        } else {
                            Instant::now()
                        }
                    } else {
                        Instant::now()
                    }
                } else {
                    Instant::now()
                };

                let state = inner_app_handle.state::<AppState>();

                if let Ok((nodes, edges, config)) = GraphicSpice::file_to_domain(file, state) {
                    if inner_app_handle
                        .emit(
                            "open_file",
                            OpenFileEventPaylad {
                                nodes,
                                edges,
                                config,
                                platform: SupportedPlatforms::GraphicSpice,
                            },
                        )
                        .is_ok()
                    {
                        let path = PathBuf::from(file_path.as_path().unwrap());

                        // If user opens a new file, we should set the state as saved to that path
                        *instance_state_guard = InstanceState::Saved {
                            last_modified,
                            path,
                        }
                    }
                }
            }

            drop(instance_state_guard);
        });
}
