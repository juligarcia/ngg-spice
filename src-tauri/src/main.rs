// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod simulator;

use cinnamon::spice::{manager::SpiceManager, spice::Spice};
use std::ffi::OsStr;
use tauri::{Listener, Manager as TauriManager};
use tauri_plugin_decorum::WebviewWindowExt;

use simulator::commands::simulate;

fn main() {
    /*
        Preguntas y problemas para ir resolviendo:

        1. Deberia inicializar el estado con un Spice runner? Deberia iniciarlo cada vez que quiero correr algo?
        No veo por que debería usar un runner cada vez, pero si si lo dejo corriendo capaz no hay buen cleanup de recursos

        2. El estado se puede acceder desde los comandos, entonces no tengo problema desde ahi:
        Podría:
            a. Inicializar el manager
            b. Hacer un parser de comandos, o enrealidad ampliar lo que seria SpiceCommand
            Para esto tengo que ver que me conviene, si agarrar el comando que manda el front: String, y parsearlo de alguna forma?
            Podría diseñar un poco más el front para ver como sería la experiencia
    */

    tauri::Builder::default()
        // .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_decorum::init())
        .setup(|app| {
            // Create a custom titlebar for main window
            // On Windows this hides decoration and creates custom window controls
            // On macOS it needs hiddenTitle: true and titleBarStyle: overlay
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();

            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(18.0, 27.0).unwrap();

            // ---------------------------------

            // Init state management

            let handle = app.handle();

            // tauri::async_runtime::spawn(async move {
            //     handle.listen_any("app-event", |event| {
            //         if let Some(payload) = event.payload() {
            //             match serde_json::from_str::<AppEvent>(payload) {
            //                 Ok(AppEvent::EventA) => handle_event_a(),
            //                 Ok(AppEvent::EventB) => handle_event_b(),
            //                 Err(_) => eprintln!("Unknown event"),
            //             }
            //         }
            //     });
            // });

            // app.manage(AppState::new());

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![simulate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
