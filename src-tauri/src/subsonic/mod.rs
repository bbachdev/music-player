use std::collections::HashMap;
use anyhow::Result;
use rand::rngs::OsRng;
use rand::Rng;

// Structs
pub mod models;

// Functions
#[tokio::main]
pub async fn get_artist_list(connection_details: models::ApiConnectionParams) -> Result<Vec<models::ArtistIndex>, anyhow::Error> {
  let connection_string = connection_details.host + "/rest/getArtists.view?u=" + &connection_details.username + "&t=" + &connection_details.md5 + "&s=" + &connection_details.salt + "&v=1.16.1&c=tauri-music-player&f=json";
  match reqwest::get(connection_string).await {
    Ok(response) => {
      match response.json::<models::ArtistResponseWrapper>().await {
        Ok(res_wrapper ) => {
          let artist_res = res_wrapper.response;
          let res_data = artist_res.artists.index;
          Ok(res_data)
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





#[tokio::main]
pub async fn ping(connection_details: models::ConnectionDetails) -> Result<models::ServerConfig, anyhow::Error> {
  let salt = generate_salt();
  let md5_pass = md5::compute(connection_details.password + &salt);

  let connection_string = connection_details.host + "/rest/ping.view?u=" + &connection_details.username + "&t=" + &format!("{:x}", md5_pass) + "&s=" + &salt + "&v=1.16.1&c=tauri-music-player&f=json";
  println!("{:?}", connection_string);
  match reqwest::get(connection_string).await {
    Ok(response) => {
      match response.json::<models::PingResponse>().await {
        Ok(res_object) => {
          let res_data = res_object.response;
          println!("{:?}", res_data);
          let config = models::ServerConfig {
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