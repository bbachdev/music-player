/* Contains functions related to cover art and extra info for artists and albums */
import { exists, mkdir, BaseDirectory, writeFile } from '@tauri-apps/plugin-fs';
import { Album } from '@/types/metadata'
import { Library } from '@/types/config';

const CONCURRENCY_LIMIT = 20

export async function getAlbumCovers(libraries: Library[], albums: Album[]) : Promise<boolean> {
  try{
    let artDirectoryExists = await exists('cover_art', {baseDir: BaseDirectory.AppLocalData})
    if(!artDirectoryExists) {
      //TODO: Look to display a loading indicator for album section
      let albumChunks: Album[] = []

      for (let i = 0; i < albums.length; i += CONCURRENCY_LIMIT) {
        let chunk = albums.slice(i, i + CONCURRENCY_LIMIT)
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

        await mkdir('cover_art', {baseDir: BaseDirectory.AppLocalData})
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