import { Library } from '@/types/config';
import { AlbumArtist, Album, Song } from '@/types/metadata';

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
    let connectionString = `${host}/rest/getAlbumList2.view?type=newest&size=500&offset=${offset}&u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    console.log('Connection String: ', connectionString);

    const res = await fetch(connectionString);
    const data = await res.json();

    console.log("Data: ", data);

    data['subsonic-response'].albumList2.album.forEach((album: any) => {
      albumList.push(album);
    });
  }));

  console.log("Album List: ", albumList)
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