use serde::{Serialize, Deserialize};
use std::collections::HashMap;
use anyhow::Result;
use rand::rngs::OsRng;
use rand::Rng;

// Structs
#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionDetails {
    host: String,
    port: Option<i16>,
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PingResponse {
  #[serde(rename = "subsonic-response")]
  response: PingResponseData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PingResponseData {
  status: String,
  version: String,
  #[serde(rename = "type")]
  server_type: String,
  #[serde(rename = "serverVersion")]
  server_version: String,
  #[serde(rename = "openSubsonic")]
  open_subsonic: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerConfig {
  server_type: String,
  md5_string: String,
  salt: String,
  open_subsonic: bool,
}

// Functions
#[tokio::main]
pub async fn ping(connection_details: ConnectionDetails) -> Result<ServerConfig, anyhow::Error> {
  let salt = generate_salt();
  let md5_pass = md5::compute(connection_details.password + &salt);

  let connection_string = connection_details.host + "/rest/ping.view?u=" + &connection_details.username + "&t=" + &format!("{:x}", md5_pass) + "&s=" + &salt + "&v=1.16.1&c=tauri-music-player&f=json";
  println!("{:?}", connection_string);
  match reqwest::get(connection_string).await {
    Ok(response) => {
      match response.json::<PingResponse>().await {
        Ok(res_object) => {
          let res_data = res_object.response;
          println!("{:?}", res_data);
          let config = ServerConfig {
            server_type: res_data.server_type,
            md5_string: format!("{:x}", md5_pass),
            salt,
            open_subsonic: res_data.open_subsonic,
          };
          Ok(config)
        },
        Err(e) => {
          println!("{:?}", e);
          let mut response = HashMap::new();
          response.insert("error".to_string(), e.to_string());
          Err(anyhow::Error::msg(e.to_string()))
        }
      }
    },
    Err(e) => {
      println!("{:?}", e);
      let mut response = HashMap::new();
      response.insert("error".to_string(), e.to_string());
      Err(anyhow::Error::msg(e.to_string()))
    }
  
  }
}

fn generate_salt() -> String {
  let mut rng = OsRng;
  let salt: u64 = rng.gen_range(0..=9999_9999_9999_9999);
  salt.to_string()
} 