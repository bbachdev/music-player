// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod subsonic;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn server_ping(details: subsonic::ConnectionDetails) -> Result<subsonic::PingResponseData, String> {
  match subsonic::ping(details) {
    Ok(response) => Ok(response),
    Err(e) => {
      //Create error
      Err(e.to_string())
    }
  }
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
