import { useQuery } from '@tanstack/react-query'
import { ScrollArea } from '../ui/scroll-area'
import { getAlbumList } from '@/util/subsonic'
import { Library } from '@/types/config'
import { useEffect, useState } from 'react'
import { appLocalDataDir } from '@tauri-apps/api/path';
import CoverArt from '@/components/library/CoverArt'
import { convertFileSrc } from '@tauri-apps/api/core';

interface AlbumSectionProps {
  selectedArtist?: string
  libraries: Library[]
  onAlbumSelected: (albumId: string) => void
  coverArtPath: string
}

export default function AlbumSection({ selectedArtist, libraries, onAlbumSelected, coverArtPath } : AlbumSectionProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(undefined)
  const { isPending, error, data: albums } = useQuery({queryKey: ['albumList'], queryFn: () => getAlbumList(libraries), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})

  if (isPending) return <div>Loading...</div>

  if (error) return <div>Error: {error.message}</div>

  function albumSelected(albumId: string) {
    setSelectedAlbum(albumId)
    onAlbumSelected(albumId)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Albums</h2>
        <ScrollArea className={`px-4`}>
          <div className={`albumGrid w-full`}>
            {albums.map((album) => {
              return (
                <button key={album.id} className={`w-fit dark:hover:bg-slate-700/90 test-left ${selectedAlbum === album.id ? 'bg-slate-700/90' : ''}`} onClick={() => albumSelected(album.id)}>
                  <CoverArt src={convertFileSrc(`${coverArtPath}/${album.id}.png`)} fallbackSrc={"https://via.placeholder.com/140"} alt="album cover" />
                  <div className={`flex flex-col`}>
                    <p className={`px-1 font-semibold text-sm line-clamp-1 break-all`}>{album.title}</p>
                    <p className={`mt-1 px-1 text-xs dark:text-slate-200/90 line-clamp-1 break-all`}>{album.artist}</p>
                  </div>
                </button>
            )})}
          </div>
          
        </ScrollArea>
      </div>
    </div>
  )
}