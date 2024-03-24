import AlbumSection from '@/components/library/AlbumSection';
import ArtistSection from '@/components/library/ArtistSection';
import Header from '@/components/library/Header';
import NowPlaying from '@/components/library/NowPlaying';
import SongSection from '@/components/library/SongSection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Song } from '@/types/metadata';
import { getAlbumDetail } from '@/util/subsonic';
import { appLocalDataDir } from '@tauri-apps/api/path';
import { useEffect, useState } from 'react';

export default function Library() {
  const [syncStatus, setSyncStatus] = useState<number>(0)
  const [coverArtPath, setCoverArtPath] = useState<string>('')
  const [songList, setSongList] = useState<Song[]>([]);
  const [playQueue, setPlayQueue] = useState<Song[] | undefined>(undefined);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [selectedAlbumArtist, setSelectedAlbumArtist] = useState<string | undefined>(undefined);
  const [nowPlaying, setNowPlaying] = useState<Song | undefined>(undefined);

  useEffect(() => {
    async function getCoverArtPath() {
      if(!coverArtPath){
        let path = await appLocalDataDir() + '/cover_art'
        console.log('Cover Art Path: ', path)
        setCoverArtPath(path)
      }
    }
    getCoverArtPath()
  }, [])

  async function selectAlbum(albumId: string) {
    console.log('Selected Album: ', albumId)
    setSongList(await getAlbumDetail(albumId))
  }

  function navigateToCurrentlyPlayingAlbum(albumId: string) {
    selectAlbum(albumId)
    setSelectedAlbumArtist(nowPlaying?.artist)
  }
  
  return (
    <div className={`flex flex-col w-full h-[stretch] max-h-screen`}>
      { !coverArtPath && (
        <div className={`flex flex-col h-[stretch]`}>
          <img className={`animate-pulse w-40 h-40 mx-auto my-auto`} src='/tauri.svg' alt='logo' />
        </div>
      )}
      { coverArtPath && (
        <>
          <Header syncStatus={syncStatus}/>
          <ResizablePanelGroup direction="horizontal">

            <ResizablePanel minSize={20}>
              <ArtistSection selectedArtist={selectedArtist} setSelectedArtist={setSelectedArtist} />
            </ResizablePanel>

            <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

            <ResizablePanel minSize={20} defaultSize={60}>
              <AlbumSection selectedArtist={selectedArtist} onAlbumSelected={selectAlbum} coverArtPath={coverArtPath} setSelectedAlbumArtist={setSelectedAlbumArtist}/>
            </ResizablePanel>

            <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

            <ResizablePanel minSize={20}>
              <SongSection songs={songList} setPlayQueue={setPlayQueue} setNowPlaying={setNowPlaying} nowPlaying={nowPlaying} selectedAlbumArtist={selectedAlbumArtist}/>
            </ResizablePanel>

          </ResizablePanelGroup>
          <NowPlaying directToCurrentAlbum={navigateToCurrentlyPlayingAlbum} nowPlaying={nowPlaying} playQueue={playQueue} setPlayQueue={setPlayQueue} setNowPlaying={setNowPlaying} coverArtPath={coverArtPath}/>
        </>
      )}      
    </div>
  )
}