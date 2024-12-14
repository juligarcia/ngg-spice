// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod simulator;

use log::Level;
use tauri::Manager as TauriManager;
use tauri_plugin_decorum::WebviewWindowExt;

use simulator::commands::simulate;

fn main() {
    tauri::Builder::default()
        // .plugin(tauri_plugin_log::Builder::new().build())
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
            // Create a custom titlebar for main window
            // On Windows this hides decoration and creates custom window controls
            // On macOS it needs hiddenTitle: true and titleBarStyle: overlay
            let main_window = app.get_webview_window("main").unwrap();
            main_window.create_overlay_titlebar().unwrap();

            #[cfg(target_os = "macos")]
            main_window.set_traffic_lights_inset(18.0, 27.0).unwrap();

            // ---------------------------------

            // TODO: Init state management

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![simulate])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
