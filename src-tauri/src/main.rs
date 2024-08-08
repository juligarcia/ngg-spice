// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    collections::VecDeque,
    sync::{Arc, RwLock},
};

use paprika::{Manager, PkSpice};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    // Create Spice instance
    let mut spice = PkSpice::<Manager>::new(std::ffi::OsStr::new(
        "/opt/homebrew/opt/libngspice/lib/libngspice.dylib",
    ))
    .unwrap();

    // Create manager with a shared buffer memory
    let buf = Arc::new(RwLock::new(VecDeque::<String>::with_capacity(10)));
    let manager = Arc::new(Manager::new(buf));

    // Initialize Spice with it's manager
    // spice.init(Some(manager));
    // spice.command("source tran.cir");
    // spice.command("tran 10u 10m");

    // spice.init(None);
    // spice.command("echo echo command");

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
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
