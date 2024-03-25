import { Library } from '@/types/config';
import { Album, AlbumArtist, Song } from '@/types/metadata';
import Database from "@tauri-apps/plugin-sql";

async function connect() {
  const db = await Database.load("sqlite:music.db");
  return db
}

// Libaries
export async function saveLibraryDetails(libaries: Library[]) {
  try{
    const db = await connect();

    for (const library of libaries) {
      if(library.type === 'local'){
        await db.execute(
          "INSERT into libraries (id, name, type, path) VALUES ($1, $2, $3, $4)",
          [library.id, library.name, library.path, library.path]
        );
      }else{
        await db.execute(
          "INSERT into libraries (id, name, type, host, port, username, md5, salt) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [library.id, library.name, library.type, library.connectionDetails.host, library.connectionDetails.port, library.connectionDetails.username, library.connectionDetails.md5, library.connectionDetails.salt]
        );
      } 
    }
  }catch(e) {
    console.error(`DB: Error saving libraries: `, e)
  }
}

export async function getLibraries() : Promise<Library[]> {
  let libraryList: Library[] = []
  try{
    const db = await connect();
    const libraries = await db.select("SELECT * FROM libraries") as any[];
    //Parse the libraries
    console.log("Unparsed Libraries: ", libraries)
    for (const library of libraries) {
      let parsedLibrary: Partial<Library> = {}
      parsedLibrary.id = library['id']
      parsedLibrary.name = library['name']
      parsedLibrary.type = library['type']
      if(library.type === 'remote'){
        parsedLibrary.connectionDetails = {
          host: library['host'],
          port: library['port'],
          username: library['username'],
          md5: library['md5'],
          salt: library['salt']
        }
      }else {
        library.path = library['path']
      }
      libraryList.push(parsedLibrary as Library)
    }

    console.log("Parsed Libraries: ", libraryList)
    return libraries
  }catch(e) {
    console.error(`DB: Error getting libraries: `, e)
    return []
  }
}

//Artists
export async function saveModifiedArtists(artists: AlbumArtist[]) {
  try{
    const db = await connect();
    let artistIds = new Set<string>()
    for (const artist of artists) {
      //Debug: Check ID
      if(artistIds.has(artist.id)){
        console.log('Duplicate Artist ID: ', artist)
      }
      artistIds.add(artist.id)
      await db.execute(`INSERT INTO artists (id, name, coverArt) VALUES ($1, $2, $3)`, [artist.id, artist.name, artist.coverArt])
    }
  }catch(e) {
    console.error(`DB: Error saving modified artists: `, e)
  }
}

export async function getArtistList() : Promise<AlbumArtist[]> {
  try{
    const db = await connect();
    return await db.select("SELECT * FROM artists") as AlbumArtist[];
  }catch(e) {
    console.error(`DB: Error getting artists: `, e)
    return []
  }
}

//Albums
export async function saveAlbums(albums: Album[]) {
  try{
    const db = await connect();
    for (const album of albums) {
      await db.execute(`INSERT INTO albums (id, parent, album, title, name, isDir, coverArt, songCount, created, duration, playCount, artistId, artist, year, genre) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`, [album.id, album.parent, album.album, album.title, album.name, album.isDir, album.coverArt, album.songCount, album.created, album.duration, album.playCount, album.artistId, album.artist, album.year, album.genre])
    }
  }catch(e) {
    console.error(`DB: Error saving albums: `, e)
  }
}

export async function getAlbumList() : Promise<Album[]> {
  try{
    const db = await connect();
    return await db.select("SELECT * FROM albums") as Album[];
  }catch(e) {
    console.error(`DB: Error getting albums: `, e)
    return []
  }
}

export async function getAlbumsForArtist(artistId: string) : Promise<Album[]> {
  try{
    const db = await connect();
    return await db.select("SELECT * FROM albums WHERE artistId = $1 ORDER BY year DESC", [artistId]) as Album[];
  }catch(e) {
    console.error(`DB: Error getting albums for artist: `, e)
    return []
  }
}

//Songs
export async function saveSongs(songs: Song[]) {
  try{
    const db = await connect();
    for (const song of songs) {
      await db.execute(`INSERT INTO songs (id, parent, title, isDir, isVideo, type, albumId, album, artist, coverArt, duration, bitRate, track, year, genre, size, discNumber, suffix, contentType, path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)`, [song.id, song.parent, song.title, song.isDir, song.isVideo, song.type, song.albumId, song.album, song.artist, song.coverArt, song.duration, song.bitRate, song.track, song.year, song.genre, song.size, song.discNumber, song.suffix, song.contentType, song.path])
    }
  }catch(e) {
    console.error(`DB: Error saving songs: `, e)
  }
}