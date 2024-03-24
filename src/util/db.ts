import { Library } from '@/types/config';
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

//TODO: Artists

//TODO: Albums

//TODO: Songs