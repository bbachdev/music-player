import { Library } from '@/types/config';
import { AlbumArtist } from '@/types/metadata';

const ARTIST_LIST = `{host}/rest/getArtists.view?u={username}&t={md5}&s={salt}&v=1.16.1&c=tauri&f=json`

export async function getArtistList(libraries: Library[]) : Promise<AlbumArtist[]> {
  const artistList: AlbumArtist[] = []
  await Promise.all(libraries.map(async (library) => {
    if (library.type === 'local') return;

    let host = library.connectionDetails.host + (library.connectionDetails.port ? `:${library.connectionDetails.port}` : '');
    let connectionString = `${host}/rest/getArtists.view?u=${library.connectionDetails.username}&t=${library.connectionDetails.md5}&s=${library.connectionDetails.salt}&v=1.16.1&c=tauri&f=json`;

    console.log('Connection String: ', connectionString);

    const res = await fetch(connectionString);
    const data = await res.json();

    console.log("Data: ", data);

    data['subsonic-response'].artists.index.forEach((artistIndex: any) => {
      artistList.push(...artistIndex.artist);
    });
  }));

  console.log("Artist List: ", artistList)
  return artistList;
}