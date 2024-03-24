import AlbumSection from '@/components/library/AlbumSection';
import ArtistSection from '@/components/library/ArtistSection';
import Header from '@/components/library/Header';
import NowPlaying from '@/components/library/NowPlaying';
import SongSection from '@/components/library/SongSection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Song } from '@/types/metadata';
import { getAlbumDetail } from '@/util/subsonic';
import { useState } from 'react';

export default function Library() {
  const [syncStatus, setSyncStatus] = useState<number>(0)
  const [songList, setSongList] = useState<Song[]>([]);
  const [playQueue, setPlayQueue] = useState<Song[] | undefined>(undefined);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [selectedAlbumArtist, setSelectedAlbumArtist] = useState<string | undefined>(undefined);
  const [nowPlaying, setNowPlaying] = useState<Song | undefined>(undefined);

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
      <Header syncStatus={syncStatus}/>
      <ResizablePanelGroup direction="horizontal">

        <ResizablePanel minSize={20}>
          <ArtistSection selectedArtist={selectedArtist} setSelectedArtist={setSelectedArtist} />
        </ResizablePanel>

        <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

        <ResizablePanel minSize={20} defaultSize={60}>
          <AlbumSection selectedArtist={selectedArtist} onAlbumSelected={selectAlbum} setSelectedAlbumArtist={setSelectedAlbumArtist}/>
        </ResizablePanel>

        <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

        <ResizablePanel minSize={20}>
          <SongSection songs={songList} setPlayQueue={setPlayQueue} setNowPlaying={setNowPlaying} nowPlaying={nowPlaying} selectedAlbumArtist={selectedAlbumArtist}/>
        </ResizablePanel>

      </ResizablePanelGroup>
      <NowPlaying directToCurrentAlbum={navigateToCurrentlyPlayingAlbum} nowPlaying={nowPlaying} playQueue={playQueue} setPlayQueue={setPlayQueue} setNowPlaying={setNowPlaying} />   
    </div>
  )
}