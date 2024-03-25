import { ScrollArea } from '../ui/scroll-area'
import {  } from '@/util/subsonic'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import CoverArt from '@/components/library/CoverArt'
import { convertFileSrc } from '@tauri-apps/api/core';
import { Album } from '@/types/metadata'
import { store } from '@/util/config'
import { getAlbumsForArtist } from '@/util/db';

interface AlbumSectionProps {
  albums: Album[] | undefined
  selectedArtist?: string
  onAlbumSelected: (albumId: string) => void
  setSelectedAlbumArtist: Dispatch<SetStateAction<string | undefined>>
}

const coverArtPath = await store.get('coverArtPath') as string

export default function AlbumSection({albums = [], selectedArtist, onAlbumSelected, setSelectedAlbumArtist } : AlbumSectionProps) {
  const [filteredAlbumList, setFilteredAlbumList] = useState<Album[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function getAlbums() {
      if(selectedArtist){
        setFilteredAlbumList(await getAlbumsForArtist(selectedArtist))
      }else{
        setFilteredAlbumList([])
      }
    }
    getAlbums()
  }, [selectedArtist])

  useEffect(() => {
    if(selectedAlbum){
      onAlbumSelected(selectedAlbum)
    }
  }, [selectedAlbum])

  function albumSelected(album: Album) {
    setSelectedAlbum(album.id)
    setSelectedAlbumArtist(album.artist)
    onAlbumSelected(album.id)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full pb-2`}>
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