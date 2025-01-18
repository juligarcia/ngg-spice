use std::fs::File;

use native_db::Database;
use tauri::{fs, Emitter, Manager};
use tauri_plugin_dialog::DialogExt;

use super::engine::LTSpice;
use crate::{
    app_state::AppState,
    compat::engine::{Engine, OpenFileEventPaylad},
};

pub fn open_lt_spice(app_handle: &tauri::AppHandle) {
    let inner_app_handle = app_handle.clone();

    app_handle
        .dialog()
        .file()
        .add_filter("LTSpice filter", &["asc"])
        .pick_file(move |lt_spice_file_path| {
            if let Some(file_path) = lt_spice_file_path {
                let file = File::open(file_path.as_path().unwrap()).unwrap();

                let state = inner_app_handle.state::<AppState>();

                if let Ok((nodes, edges, config)) = LTSpice::file_to_domain(file, state) {
                    inner_app_handle
                        .emit(
                            "open_file",
                            OpenFileEventPaylad {
                                nodes,
                                edges,
                                config,
                            },
                        )
                        .unwrap();
                }
            }
        });
}
