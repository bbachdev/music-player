import { Library } from '@/types/config';
import { AlbumArtist, Album, Song } from '@/types/metadata';
import { BaseDirectory, mkdir, exists } from '@tauri-apps/plugin-fs';
import { getAlbumCovers } from '@/util/musicinfo';
import { store } from '@/util/config';

export async function getArtistList() : Promise<AlbumArtist[]> {
  const libraries = await store.get('libraries') as Library[];
  const artistList: AlbumArtist[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getArtists.view?u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    const res = await fetch(connectionString);
    const data = await res.json();

    data['subsonic-response'].artists.index.forEach((artistIndex: any) => {
      artistList.push(...artistIndex.artist);
    });
    
  }));

  return artistList;
}

export async function getAlbumList() : Promise<Album[]> {
  const libraries = await store.get('libraries') as Library[];
  const albumList: Album[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    let offset = 0

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getAlbumList2.view?type=frequent&size=500&offset=${offset}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    const res = await fetch(connectionString);
    const data = await res.json();

    data['subsonic-response'].albumList2.album.forEach((album: any) => {
      albumList.push(album);
    });
  }));

  //If cover art directory doesn't exist, create it and populate it
  getAlbumCovers(libraries, albumList, true);
  
  return albumList;
}

export async function getAlbumsForArtist(artistId: string) : Promise<Album[]> {
  const libraries = await store.get('libraries') as Library[];
  let albumList: Album[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getArtist.view?id=${artistId}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    const res = await fetch(connectionString);
    const data = await res.json();

    data['subsonic-response'].artist.album.forEach((album: any) => {
      albumList.push(album);
    });
  }));

  //If art doesn't exists for the albums, get them
  let coverChecks = await Promise.all(albumList.map(async (album) => {
    let artExists = await exists(`cover_art/${album.id}.png`, { baseDir: BaseDirectory.AppLocalData });
    return { album, artExists };
  }));

  let coversToRetrieve = coverChecks.filter(({ artExists }) => artExists === false).map(({ album }) => album);


  if (coversToRetrieve.length > 0) {
    getAlbumCovers(libraries, coversToRetrieve, false);
  }

  //Sort by year
  albumList = albumList.sort((a, b) => {
    if (!b.year || a.year > b.year) return -1;
    if (a.year < b.year) return 1;
    return 0;
  });

  return albumList;
}

export async function getAlbumDetail(albumId: string) : Promise<Song[]> {
  const libraries = await store.get('libraries') as Library[];
  const songList: Song[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getAlbum.view?id=${albumId}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json&id=${albumId}`;

    const res = await fetch(connectionString);
    const data = await res.json();

    data['subsonic-response'].album.song.forEach((song: any) => {
      songList.push(song);
    });
  }));

  return songList;
}

export async function stream(song: Song) : Promise<string | undefined> {
  const libraries = await store.get('libraries') as Library[];
  //TODO: Rewrite to get around multiple libraries

  let host = '';
  let connectionString = '';

  let library = libraries[0];

  if (library.type === 'local') return;

  host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
  connectionString = `${host}/rest/stream.view?id=${song.id}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

  const res = await fetch(connectionString);
  const data = await res.arrayBuffer()

  return URL.createObjectURL(new Blob([data], {type: song.contentType}));
}

export async function scrobble(songId: string) : Promise<boolean> {
  const libraries = await store.get('libraries') as Library[];
  let library = libraries[0];

  if (library.type === 'local') return false;

  let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
  let connectionString = `${host}/rest/scrobble.view?id=${songId}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

  const res = await fetch(connectionString);
  const data = await res.json()

  return data['subsonic-response'].status === 'ok';
}

export async function getIndexes(library: Library) : Promise<AlbumArtist[]> {
  if(library.type === 'local') return [];
  let modifiedArtists: AlbumArtist[] = []

  let lastSynced = await store.get('lastSync') as number || 0;

  let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
  let connectionString = `${host}/rest/getIndexes.view?u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json&ifModifiedSince=${lastSynced}`;

  const res = await fetch(connectionString);
  const data = await res.json()

  //Return list of modified artists (if any)
  if(data['subsonic-response'].indexes.lastModified <= lastSynced) return modifiedArtists;
  data['subsonic-response'].indexes.index.forEach((letterIndex: any) => {
    letterIndex.artist.forEach((artist: any) => {
      modifiedArtists.push(artist as AlbumArtist);
    })
  })

  return modifiedArtists;
}