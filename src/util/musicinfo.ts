/* Contains functions related to cover art and extra info for artists and albums */
import { exists, mkdir, BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { Album, AlbumArtist, Song } from '@/types/metadata'
import { Library } from '@/types/config';
import { getAlbumDetail, getAlbumsForArtist, getIndexes } from './subsonic';

const ALBUM_ART_CONCURRENCY_LIMIT = 20
const ALBUM_CONCURRENCY_LIMIT = 20
const SONG_CONCURRENCY_LIMIT = 20

export async function getAlbumCovers(libraries: Library[], albums: Album[], full: boolean) : Promise<boolean> {
  try{
    let artDirectoryExists = await exists('cover_art', {baseDir: BaseDirectory.AppLocalData})
    if(!full || !artDirectoryExists) {
      //TODO: Look to display a loading indicator for album section
      let albumChunks: Album[] = []

      for (let i = 0; i < albums.length; i += ALBUM_ART_CONCURRENCY_LIMIT) {
        let chunk = albums.slice(i, i + ALBUM_ART_CONCURRENCY_LIMIT)
        albumChunks.push(...chunk)
      }

      //TODO: Work with multiple libraries
      let library = libraries[0]

      let coverMap = new Map<string, ArrayBuffer>()
      await Promise.all(albumChunks.map(async (album) => {
        let cover = await getAlbumCover(library, album)
        if (cover) {
          coverMap.set(album.id, cover.get(album.id)!)
        }
      })).then(async () => {
        console.log('Cover Map: ', coverMap)

        if(full === true) {
          await mkdir('cover_art', {baseDir: BaseDirectory.AppLocalData})
        }   
        await Promise.all([...coverMap].map(async ([key, value]) => {
          await writeFile(`cover_art/${key}.png`, new Uint8Array(value), {baseDir: BaseDirectory.AppLocalData})
        }))
    })}
  }catch(e){
    console.log('Error getting album covers: ', e)
    return false
  }
  
  return true
}

async function getAlbumCover(library: Library, album: Album) : Promise<Map<string, ArrayBuffer> | undefined> {
  if (library.type === 'local') return;

  let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
  let connectionString = `${host}/rest/getCoverArt.view?id=${album.id}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;
  console.log("Connection String: ", connectionString)

  const res = await fetch(connectionString);
  const data = await res.arrayBuffer()
  
  return new Map<string, ArrayBuffer>().set(album.id, data)
}

export async function syncAlbumArt() {
  try{
    //Create the cover art directory if it doesn't exist
    let artDirectoryExists = await exists('cover_art', {baseDir: BaseDirectory.AppLocalData})
    if(!artDirectoryExists) {
      await mkdir('cover_art', {baseDir: BaseDirectory.AppLocalData})
    }
    //TODO: Get all albums from the database

  }catch(e){
    console.log('Error syncing album art: ', e)
  }
}

export async function getAlbumsForMultipleArtists(artists: AlbumArtist[]) : Promise<Album[]> {
  try{
    let albumList: Album[] = []
    const albumPromises: Promise<any>[] = [];

    // Helper function to process promises with concurrency limit
    const processQueue = async () => {
      while (albumPromises.length) {
          const promisesBatch = albumPromises.splice(0, ALBUM_CONCURRENCY_LIMIT);
          const albums: Album[][] = await Promise.all(promisesBatch);
          for (const albumArray of albums) {
            for (const album of albumArray) {
              albumList.push(album as Album)
            }
          }
      }
    };

    // Create promises for fetching albums for each artist
    artists.forEach(artist => {
        if(artist.albumCount === 0) return;
        const promise = getAlbumsForArtist(artist.id);
        albumPromises.push(promise);
    });

    // Process promises with concurrency limit
    await processQueue();

    return albumList
  }catch(e){
    console.log('Error getting albums for multiple artists: ', e)
    return []
  }
}

export async function getSongsForMultipleAlbums(albums: Album[]) : Promise<Song[]> {
  let songList: Song[] = []
  const songPromises: Promise<any>[] = [];
  try{
     // Helper function to process promises with concurrency limit
     const processQueue = async () => {
      while (songPromises.length) {
          const promisesBatch = songPromises.splice(0, SONG_CONCURRENCY_LIMIT);
          const songs: Song[][] = await Promise.all(promisesBatch);
          for (const songArray of songs) {
            for (const song of songArray) {
              songList.push(song as Song)
            }
          }
      }
    };

    // Create promises for fetching songs for each album
    for (const album of albums) {
      const promise = getAlbumDetail(album.id);
      songPromises.push(promise)
    }

    // Process promises with concurrency limit
    await processQueue();

    return songList
  }catch(e){
    console.log('Error getting songs for multiple albums: ', e)
    return []
  }
}