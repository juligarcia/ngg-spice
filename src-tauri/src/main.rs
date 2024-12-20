// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;

use gspice::{
    app_state::{models::bjt::DATABASE_BJT_MODELS, AppState},
    init::models::init_models,
};

use log::Level;
use tauri::Manager as TauriManager;
use tauri_plugin_decorum::WebviewWindowExt;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_decorum::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .filter(|metadata| match metadata.level() {
                    Level::Trace => false,
                    _ => true,
                })
                .format(|out, message, record| {
                    out.finish(format_args!("[{}]: {}", record.level(), message))
                })
                .build(),
        )
        .setup(|app| {
            // ----------------- GENERAL SETUP -------------------

            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Couldn't resolve app data dir");

            let resource_dir = app
                .path()
                .resource_dir()
                .expect("Couldn't resolve resource dir");

            log::debug!("{:?}", app_data_dir);

            fs::create_dir_all(&app_data_dir).expect("Failed to create AppData directory");

            // ----------------- WINDOW SETUP -------------------
            // TODO: chequear windows y linux

            // Creates a custom titlebar for main window on MacOS
            #[cfg(target_os = "macos")]
            {
                let main_window = app.get_webview_window("main").unwrap();
                main_window.create_overlay_titlebar().unwrap();
                main_window.set_traffic_lights_inset(18.0, 27.0).unwrap();
            }

            // ----------------- DB SETUP -------------------

            let native_builder = native_db::Builder::new();
            let bjt_models_db_dir = app_data_dir.join("bjt_models_db");

            // Check if db file exists, if not, create it
            let bjt_models_db = if Path::new(&bjt_models_db_dir).exists() {
                // Open database
                native_builder
                    .open(&DATABASE_BJT_MODELS, &bjt_models_db_dir)
                    .unwrap()
            } else {
                // Create
                let db = native_builder
                    .create(&DATABASE_BJT_MODELS, &bjt_models_db_dir)
                    .unwrap();

                // And populate the db
                init_models(resource_dir.join("models/bjt/models_seed_data.txt"), &db);

                db
            };

            // ----------------- END SETUP -------------------

            app.manage(AppState {
                bjt_models: bjt_models_db,
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            gspice::simulator::commands::simulate,
            gspice::app_state::models::bjt::load_bjt_models,
            gspice::app_state::models::bjt::save_bjt_model,
            gspice::compat::commands::parse_bjt_model_directive
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
