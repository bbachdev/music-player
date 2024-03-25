import { ScrollArea } from '../ui/scroll-area'
import { AlbumArtist } from '@/types/metadata'
import { Dispatch, SetStateAction } from 'react'

interface ArtistSectionProps {
  artistList: AlbumArtist[] | undefined
  selectedArtist: string | undefined
  setSelectedArtist: Dispatch<SetStateAction<string | undefined>>
}

export default function ArtistSection({ artistList, selectedArtist, setSelectedArtist } : ArtistSectionProps) {
  // const { isPending, error, data: artistList } = useQuery({queryKey: ['artistList'], queryFn: () => getArtistList(), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})

  if (!artistList) return <div>Loading...</div>

  function handleClick(e: React.MouseEvent<HTMLButtonElement>, artistId: string) {
    if ((e.ctrlKey || e.metaKey) && selectedArtist === artistId) {
      //Deselect artist
      setSelectedArtist(undefined)
    }else{
      setSelectedArtist(artistId)
    }
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full pb-2`}>
        <h2 className={`p-2`}>Artists</h2>
        <ScrollArea className={`w-full`}>
          <div className={`flex flex-col text-left`}>
              {artistList.map((artist: AlbumArtist) => {
              return <button key={artist.name} className={`dark:hover:bg-slate-700/90 text-left p-2 ${selectedArtist === artist.id ? 'bg-slate-700/90' : ''}`} onClick={(e) => handleClick(e, artist.id)}><span className={`p-1`}>{artist.name}</span></button>
            })}
          </div>
          
        </ScrollArea>
      </div>
    </div>
  )
}