import { ScrollArea } from '../ui/scroll-area'
import { Library } from '@/types/config'
import { useQuery} from '@tanstack/react-query'
import { getArtistList } from '@/util/subsonic'
import { AlbumArtist } from '@/types/metadata'

interface ArtistSectionProps {
  libraries: Library[]
}

export default function ArtistSection({ libraries } : ArtistSectionProps) {
  const { isPending, error, data: artistList } = useQuery({queryKey: ['artistList'], queryFn: () => getArtistList(libraries), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})

  if (isPending) return <div>Loading...</div>

  //TODO: Make a better error message
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Artists</h2>
        <ScrollArea className={`w-full`}>
          <div className={`flex flex-col text-left`}>
              {artistList.map((artist: AlbumArtist) => {
              return <button key={artist.name} className={`dark:hover:bg-slate-700/90 text-left p-2`}><span className={`p-1`}>{artist.name}</span></button>
            })}
          </div>
          
        </ScrollArea>
      </div>
    </div>
  )
}