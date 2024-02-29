import AlbumSection from '@/components/library/AlbumSection';
import ArtistSection from '@/components/library/ArtistSection';
import Header from '@/components/library/Header';
import NowPlaying from '@/components/library/NowPlaying';
import SongSection from '@/components/library/SongSection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Config } from '@/types/config';
import { Song } from '@/types/metadata';
import { getAlbumDetail } from '@/util/subsonic';
import { appLocalDataDir } from '@tauri-apps/api/path';
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { useEffect, useState } from 'react';

export default function Library() {
  const [coverArtPath, setCoverArtPath] = useState<string>('')
  const [config, setConfig] = useState<Config>();
  const [songList, setSongList] = useState<Song[]>([]);
  const [playQueue, setPlayQueue] = useState<Song[] | undefined>(undefined);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [nowPlaying, setNowPlaying] = useState<Song | undefined>(undefined);

  useEffect(() => {
    async function getConfig() {
      const config = await readTextFile('config.json', {baseDir: BaseDirectory.AppLocalData});
      setConfig(JSON.parse(config))
    }

    getConfig()
  }, [])

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
    setSongList(await getAlbumDetail(config!.libraries, albumId))
  }
  
  return (
    <div className={`flex flex-col w-full h-[stretch]`}>
      { !config && (
        <div className={`flex flex-col h-[stretch]`}>
          <img className={`animate-pulse w-40 h-40 mx-auto my-auto`} src='/tauri.svg' alt='logo' />
        </div>
      )}
      { config && (
        <>
          <Header/>
          <ResizablePanelGroup direction="horizontal">

            <ResizablePanel minSize={20}>
              <ArtistSection selectedArtist={selectedArtist} setSelectedArtist={setSelectedArtist} libraries={config!.libraries} />
            </ResizablePanel>

            <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

            <ResizablePanel minSize={20} defaultSize={60}>
              <AlbumSection selectedArtist={selectedArtist} libraries={config!.libraries} onAlbumSelected={selectAlbum} coverArtPath={coverArtPath}/>
            </ResizablePanel>

            <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

            <ResizablePanel minSize={20}>
              <SongSection songs={songList} setPlayQueue={setPlayQueue} setNowPlaying={setNowPlaying}/>
            </ResizablePanel>

          </ResizablePanelGroup>
          <NowPlaying libraries={config!.libraries} nowPlaying={nowPlaying} playQueue={playQueue} setNowPlaying={setNowPlaying} coverArtPath={coverArtPath}/>
        </>
      )}      
    </div>
  )
}