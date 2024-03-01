import { Library } from '@/types/config';
import { AlbumArtist, Album, Song } from '@/types/metadata';
import { BaseDirectory, mkdir, exists } from '@tauri-apps/plugin-fs';
import { getAlbumCovers } from '@/util/musicinfo';

export async function getArtistList(libraries: Library[]) : Promise<AlbumArtist[]> {
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

export async function getAlbumList(libraries: Library[]) : Promise<Album[]> {
  const albumList: Album[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    //TODO: Add artist filter

    let offset = 0

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getAlbumList2.view?type=frequent&size=500&offset=${offset}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    console.log('Connection String: ', connectionString);

    const res = await fetch(connectionString);
    const data = await res.json();

    console.log("Data: ", data);

    data['subsonic-response'].albumList2.album.forEach((album: any) => {
      albumList.push(album);
    });
  }));

  //If cover art directory doesn't exist, create it and populate it
  getAlbumCovers(libraries, albumList, true);

  console.log("Album List: ", albumList)
  return albumList;
}

export async function getAlbumsForArtist(libraries: Library[], artistId: string) : Promise<Album[]> {
  const albumList: Album[] = []
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
  let coversToRetrieve = albumList.filter(async (album) => {
    let artExists = await exists(`cover_art/${album.id}.png`, {baseDir: BaseDirectory.AppLocalData});
    return !artExists;
  });

  if (coversToRetrieve.length > 0) {
    console.log("Covers to Retrieve: ", coversToRetrieve)
    getAlbumCovers(libraries, coversToRetrieve, false);
  }

  //Sort by year
  albumList.sort((a, b) => {
    if (a.year > b.year) return -1;
    if (a.year < b.year) return 1;
    return 0;
  });

  console.log("Artist Albums: ", albumList)
  return albumList;
}

export async function getAlbumDetail(libraries: Library[], albumId: string) : Promise<Song[]> {
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

  console.log("Song List: ", songList)
  return songList;
}

export async function stream(song: Song, libraries: Library[]) : Promise<string | undefined> {
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