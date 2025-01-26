// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::Path;
use std::{fs, sync::Mutex};

use gspice::compat::spice::{
    graphic_spice::commands::{open_graphic_spice, save_graphic_spice},
    lt_spice::commands::open_lt_spice,
};
use gspice::{
    app_state::{instance::InstanceState, models::bjt::DATABASE_BJT_MODELS, AppState},
    init::models::init_models,
};

use log::Level;
use serde::Deserialize;
use tauri::menu::{Menu, MenuId, MenuItem, Submenu};
use tauri::{Emitter, Manager as TauriManager, State};
use tauri_plugin_decorum::WebviewWindowExt;
use tauri_plugin_dialog::DialogExt;

#[derive(serde::Serialize, Deserialize, Clone)]
struct ClearForNewFilePayload;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
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
            let main_window = app.get_webview_window("main").unwrap();

            // ----------------- Context Menus -------------------

            // Define custom menu items
            let new_file = MenuItem::with_id(app, "new_file", "New", true, None::<&str>)?;
            let open_file = MenuItem::with_id(app, "open_file", "Open", true, None::<&str>)?;
            let save_file = MenuItem::with_id(app, "save_file", "Save", true, None::<&str>)?;

            let lt_spice_open_file =
                MenuItem::with_id(app, "lt_spice_open_file", "Open", true, None::<&str>)?;
            // TODO: Implement
            // let lt_spice_save =
            //     MenuItem::with_id(app, "lt_spice_save", "Save", true, None::<&str>)?;

            // Define submenus
            let lt_spice_menu = Submenu::with_id(app, "lt_spice_compat_menu", "LT Spice", true)?;
            lt_spice_menu.insert_items(&[&lt_spice_open_file], 0)?;

            let compat_sub_menu = Submenu::with_id(app, "compat_sub_menu", "Compatibility", true)?;
            compat_sub_menu.insert(&lt_spice_menu, 0)?;

            let file_menu = Submenu::with_id(app, "file", "File", true)?;

            file_menu.insert_items(&[&new_file, &open_file, &save_file, &compat_sub_menu], 0)?;

            let app_menu = Menu::default(app.app_handle()).unwrap();

            app_menu.remove_at(1)?;
            app_menu.insert(&file_menu, 1)?;
            app_menu.remove_at(2)?;
            app_menu.remove_at(3)?;
            app_menu.remove_at(4)?;
            app_menu.remove_at(5)?;

            app.set_menu(app_menu)?;

            // ----------------- GENERAL SETUP -------------------

            let app_data_dir = app
                .path()
                .app_data_dir()
                .expect("Couldn't resolve app data dir");

            let resource_dir = app
                .path()
                .resource_dir()
                .expect("Couldn't resolve resource dir");

            fs::create_dir_all(&app_data_dir).expect("Failed to create AppData directory");

            // ----------------- WINDOW SETUP -------------------
            // Creates a custom titlebar for main window on MacOS
            #[cfg(target_os = "macos")]
            {
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
                instance_state: Mutex::new(InstanceState::NotSaved),
            });

            Ok(())
        })
        .on_menu_event(|app, event| match event.id {
            MenuId(id) if id == "lt_spice_open_file" => {
                open_lt_spice(app);
            }

            MenuId(id) if id == "save_file" => {
                let app_state: State<AppState> = app.state();
                let instance_state_guard = app_state.instance_state.lock().unwrap();
                let instance_state: InstanceState = (*instance_state_guard).clone();
                drop(instance_state_guard);

                match instance_state {
                    InstanceState::NotSaved => {
                        save_graphic_spice(app, None);
                    }
                    InstanceState::Saved { path, .. } => {
                        save_graphic_spice(app, Some(path));
                    }
                    InstanceState::FailedToSave { path, .. } => {
                        save_graphic_spice(app, Some(path));
                    }
                }
            }

            MenuId(id) if id == "open_file" => {
                // TODO: Based off of instance state, one could prompt to first save the old file before opening a new one
                open_graphic_spice(app);
            }

            MenuId(id) if id == "new_file" => {
                let app_state: State<AppState> = app.state();
                let instance_state_guard = app_state.instance_state.lock().unwrap();
                let instance_state: InstanceState = (*instance_state_guard).clone();
                drop(instance_state_guard);

                let inner_app_handle = app.app_handle().clone();

                // If the file has not been saved, prompt the user to save it
                match instance_state {
                    InstanceState::NotSaved => {
                        app.dialog()
                            .message(
                                "Do you want to save the current file before creating a new one?",
                            )
                            .buttons(tauri_plugin_dialog::MessageDialogButtons::YesNo)
                            .show(move |result| {
                                match result {
                                    true => {
                                        save_graphic_spice(&inner_app_handle, None);
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                    false => {
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                };

                                let app_state: State<AppState> = inner_app_handle.state();
                                let mut instance_state_guard =
                                    app_state.instance_state.lock().unwrap();
                                *instance_state_guard = InstanceState::NotSaved;
                                drop(instance_state_guard);
                            });
                    }

                    InstanceState::Saved { path, .. } => {
                        app.dialog()
                            .message(
                                "Do you want to save the current file before creating a new one?",
                            )
                            .buttons(tauri_plugin_dialog::MessageDialogButtons::YesNo)
                            .show(move |result| {
                                match result {
                                    true => {
                                        save_graphic_spice(&inner_app_handle, Some(path.clone()));
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                    false => {
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                };

                                let app_state: State<AppState> = inner_app_handle.state();
                                let mut instance_state_guard =
                                    app_state.instance_state.lock().unwrap();
                                *instance_state_guard = InstanceState::NotSaved;
                                drop(instance_state_guard);
                            });
                    }

                    InstanceState::FailedToSave { path, .. } => {
                        app.dialog()
                            .message(
                                "Do you want to save the current file before creating a new one?",
                            )
                            .buttons(tauri_plugin_dialog::MessageDialogButtons::YesNo)
                            .show(move |result| {
                                match result {
                                    true => {
                                        save_graphic_spice(&inner_app_handle, Some(path.clone()));
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                    false => {
                                        inner_app_handle
                                            .emit("clear_for_new_file", ClearForNewFilePayload);
                                    }
                                };

                                let app_state: State<AppState> = inner_app_handle.state();
                                let mut instance_state_guard =
                                    app_state.instance_state.lock().unwrap();
                                *instance_state_guard = InstanceState::NotSaved;
                                drop(instance_state_guard);
                            });
                    }
                }
            }

            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            gspice::simulator::commands::simulate,
            gspice::app_state::models::bjt::load_bjt_models,
            gspice::app_state::models::bjt::save_bjt_model,
            gspice::compat::commands::parse_bjt_model_directive,
            gspice::compat::spice::graphic_spice::commands::save_graphic_spice_from_domain,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
