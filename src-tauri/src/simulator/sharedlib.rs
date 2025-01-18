use std::path::PathBuf;

use tauri::{AppHandle, Manager};

pub fn get_shared_lib_path(app_handle: &AppHandle, thread_id: usize) -> PathBuf {
    let path = match tauri_plugin_os::platform() {
        "macos" => format!("lib/libngspice.{}.dylib", thread_id),
        // TODO: add windows format
        "windows" => String::default(),
        "linux" => format!("lib/libngspice.so.{}", thread_id),

        _ => panic!("Unsupported platform"),
    };

    return app_handle
        .path()
        .resolve(path, tauri::path::BaseDirectory::Resource)
        .unwrap();
}
