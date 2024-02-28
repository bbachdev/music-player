use serde::{Serialize, Deserialize};

//Ping
#[derive(Debug, Serialize, Deserialize)]
pub struct ConnectionDetails {
    pub host: String,
    pub port: Option<i16>,
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PingResponse {
  #[serde(rename = "subsonic-response")]
  pub response: PingResponseData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PingResponseData {
  status: String,
  version: String,
  #[serde(rename = "type")]
  pub server_type: String,
  #[serde(rename = "serverVersion")]
  server_version: String,
  #[serde(rename = "openSubsonic")]
  pub open_subsonic: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ServerConfig {
  pub server_type: String,
  pub md5_string: String,
  pub salt: String,
  pub open_subsonic: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApiConnectionParams {
    pub host: String,
    pub port: Option<i16>,
    pub username: String,
    pub md5: String,
    pub salt: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistResponseWrapper {
  #[serde(rename = "subsonic-response")]
  pub response: ArtistResponse,
}
//Get Artists
#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistResponse {
  //Regular Response
  pub status: String,
  pub version: String,
  #[serde(rename = "type")]
  pub server_type: String,
  #[serde(rename = "serverVersion")]
  pub server_version: String,
  #[serde(rename = "openSubsonic")]
  pub open_subsonic: bool,
  //Artist Specific
  pub artists: ArtistWrapper
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistWrapper {
  #[serde(rename = "ignoredArticles")]
  ignored_articles: String,
  pub index: Vec<ArtistIndex>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ArtistIndex {
  pub name: String,
  pub artist: Vec<Artist>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Artist {
  pub id: String,
  pub name: String,
  #[serde(rename = "coverArt")]
  pub cover_art: String,
  #[serde(rename = "albumCount")]
  pub album_count: i8,
}

//Get Albums
// pub struct AlbumListRequest {
//   pub retrieve_type: String,
//   pub size: i8,
//   pub offset: i8,
// }

//Get Songs