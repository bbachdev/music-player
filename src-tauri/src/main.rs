// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod subsonic;

#[tauri::command]
fn server_ping(details: subsonic::models::ConnectionDetails) -> Result<subsonic::models::ServerConfig, String> {
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
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![server_ping])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
