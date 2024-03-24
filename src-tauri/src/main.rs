// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};
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
  let table_migration = Migration {
    version: 1,
    description: "create_initial_tables",
    sql: "CREATE TABLE libraries(id text PRIMARY KEY,name text,type text,path text,host text,port integer,username text,md5 text,salt text); CREATE TABLE artists(id text PRIMARY KEY,name text,coverArt text); CREATE TABLE albums(id text PRIMARY KEY,parent text,album text,title text,name text,isDir integer,coverArt text,songCount integer,created Date,duration integer,playCount integer,artistId text,artist text,year integer,genre text); CREATE TABLE songs(id text PRIMARY KEY,parent text,title text,isDir integer,isVideo integer,type text,albumId text,album text,artist text,coverArt text,duration integer,bitRate integer,track integer,year integer,genre text,size integer,discNumber integer,suffix text,contentType text,path text);",
    kind: MigrationKind::Up,
  };

  let migrations = vec![table_migration];

  tauri::Builder::default()
      .plugin(tauri_plugin_fs::init())
      .plugin(tauri_plugin_shell::init())
      .plugin(tauri_plugin_store::Builder::default().build())
      .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:music.db", migrations).build())
      .invoke_handler(tauri::generate_handler![server_ping])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
