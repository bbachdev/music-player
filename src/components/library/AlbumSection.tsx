import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '../ui/scroll-area'
import { getAlbumList, getAlbumsForArtist } from '@/util/subsonic'
import { Library } from '@/types/config'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CoverArt from '@/components/library/CoverArt'
import { convertFileSrc } from '@tauri-apps/api/core';
import { Album } from '@/types/metadata'

interface AlbumSectionProps {
  selectedArtist?: string
  libraries: Library[]
  onAlbumSelected: (albumId: string) => void
  coverArtPath: string
  setSelectedAlbumArtist: Dispatch<SetStateAction<string | undefined>>
}

export default function AlbumSection({ selectedArtist, libraries, onAlbumSelected, coverArtPath, setSelectedAlbumArtist } : AlbumSectionProps) {
  const [filteredAlbumList, setFilteredAlbumList] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(undefined)
  const { isPending, error, data: albums } = useQuery({queryKey: ['albumList'], queryFn: () => getAlbumList(libraries), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})

  useEffect(() => {
    async function getAlbums() {
      console.log("Selected Artist: ", selectedArtist)
      if(selectedArtist){
        setFilteredAlbumList(await getAlbumsForArtist(libraries, selectedArtist))
      }else{
        setFilteredAlbumList([])
      }
    }
    getAlbums()
  }, [selectedArtist])

  if (isPending) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  function albumSelected(album: Album) {
    setSelectedAlbum(album.id)
    setSelectedAlbumArtist(album.artist)
    onAlbumSelected(album.id)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Albums</h2>
        <ScrollArea className={`px-4`}>
          <div className={`albumGrid w-full`}>

            {filteredAlbumList.length > 0 && (
              <>
                {filteredAlbumList.map((album) => {
                  return (
                    <button key={album.id} className={`w-fit dark:hover:bg-slate-700/90 ${selectedAlbum === album.id ? 'bg-slate-700/90' : ''}`} onClick={() => albumSelected(album)}>
                      <CoverArt src={convertFileSrc(`${coverArtPath}/${album.id}.png`)} fallbackSrc={"https://via.placeholder.com/140"} alt="album cover" style={{ height: '140px', width: '140px' }}/>
                      <div className={`flex flex-col`}>
                        <p className={`px-1 font-semibold text-sm line-clamp-1 break-all`}>{album.title}</p>
                        <p className={`mt-1 px-1 text-xs dark:text-slate-200/90 line-clamp-1 break-all`}>{album.artist}</p>
                      </div>
                    </button>
                  )}
                )}
              </>
            )}

            {filteredAlbumList.length === 0 && (
              <>
                {albums.map((album) => {
                return (
                  <button key={album.id} className={`w-fit dark:hover:bg-slate-700/90 ${selectedAlbum === album.id ? 'bg-slate-700/90' : ''}`} onClick={() => albumSelected(album)}>
                    <CoverArt src={convertFileSrc(`${coverArtPath}/${album.id}.png`)} fallbackSrc={"https://via.placeholder.com/140"} alt="album cover" style={{ height: '140px', width: '140px' }}/>
                    <div className={`flex flex-col`}>
                      <p className={`px-1 font-semibold text-sm line-clamp-1 break-all`}>{album.title}</p>
                      <p className={`mt-1 px-1 text-xs dark:text-slate-200/90 line-clamp-1 break-all`}>{album.artist}</p>
                    </div>
                  </button>
                )}
              )}
            </>
          )}
          </div>
          
        </ScrollArea>
      </div>
    </div>
  )
}