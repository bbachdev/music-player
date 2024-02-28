import { useEffect, useState } from 'react'
import { ScrollArea } from '../ui/scroll-area'
import { invoke } from '@tauri-apps/api/core'
import { Library } from '@/types/config'

interface ArtistSectionProps {
  libraries: Library[]
}

export default function ArtistSection({ libraries } : ArtistSectionProps) {
  const [artists, setArtists] = useState<any[]>([])

  useEffect(() => {
    //TODO: Make more modular + flexible
    async function getArtists() {
      const reqObject = {
        host: libraries[0].connectionDetails!.host,
        port: libraries[0].connectionDetails!.port,
        username: libraries[0].connectionDetails!.username,
        md5: libraries[0].connectionDetails!.md5,
        salt: libraries[0].connectionDetails!.salt,
      }
      const res: any[] = await invoke(`get_artists`, { 'details': reqObject})
      //Get each index and add to list
      console.log("Artists: ", res)
      const artistList: any[] = []
      res.forEach((artistIndex: any) => {
        console.log("Artist Index: ", artistIndex)
        artistList.push(...artistIndex.artist)
      })
      console.log("Final List: ", artistList)
      setArtists(artistList)
    }

    getArtists()
  }, [])

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Artists</h2>
        <ScrollArea className={`w-full px-4`}>
          {artists.map((artist) => {
            return <div key={artist.name} className={`p-1`}>{artist.name}</div>
          })}
        </ScrollArea>
      </div>
    </div>
  )
}