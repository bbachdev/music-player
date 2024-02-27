// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Serialize, Deserialize};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}


#[derive(Debug, Serialize, Deserialize)]
struct ConnectionDetails {
    host: String,
    port: Option<i16>,
    username: String,
    password: String,
}

#[tauri::command]
fn server_ping(connectionDetails: ConnectionDetails) -> String {
    "pong".to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![server_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
