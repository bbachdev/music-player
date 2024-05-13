import AlbumSection from '@/components/library/AlbumSection';
import ArtistSection from '@/components/library/ArtistSection';
import Header from '@/components/library/Header';
import NowPlaying from '@/components/library/NowPlaying';
import SongSection from '@/components/library/SongSection';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Album, Song } from '@/types/metadata';
import { store } from '@/util/config';
import { getAlbumDetail, getAlbumList, getIndexes } from '@/util/subsonic';
import { useEffect, useState } from 'react';
import { Library as UserLibrary } from '@/types/config';
import { getArtistList, saveAlbums, saveModifiedArtists, saveSongs } from '@/util/db';
import { getAlbumsForMultipleArtists, getSongsForMultipleAlbums } from '@/util/musicinfo';
import { useQuery } from '@tanstack/react-query';

export default function Library() {
  const [syncStatus, setSyncStatus] = useState<number>(0)
  const [songList, setSongList] = useState<Song[]>([]);
  const [playQueue, setPlayQueue] = useState<Song[] | undefined>(undefined);
  const [selectedArtist, setSelectedArtist] = useState<string | undefined>(undefined);
  const [selectedAlbumArtist, setSelectedAlbumArtist] = useState<string | undefined>(undefined);
  const [nowPlaying, setNowPlaying] = useState<Song | undefined>(undefined);

  //Music data
  const { data: artistList, refetch: refetchArtists } = useQuery({queryKey: ['artistList'], queryFn: () => getArtistList(), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})
  //Still get the "Recently Played" albums from server (it's helpful, real-time, and not too much data to fetch). Might change later.
  const { data: albums, refetch: refetchAlbums } = useQuery({queryKey: ['albumList'], queryFn: () => getAlbumList(), refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false})

  useEffect(() => {
    async function sync() {
      let libraries = await store.get('libraries') as UserLibrary[]
      for (const library of libraries) {
        if(library.type === 'remote'){
          let modifiedArtists = await getIndexes(library, false)
          console.log('Modified Artists: ', modifiedArtists)
          if(modifiedArtists.length > 0){
            //setSyncStatus(1)
            //Save the modified artists to the database (any new artists)
            await saveModifiedArtists(modifiedArtists)
            //TODO: If "albumCount" is 0, should we delete from db?

            //Grab albums for each artist
            let albumList: Album[] = await getAlbumsForMultipleArtists(modifiedArtists)
            await saveAlbums(albumList)

            //Grab songs for each album
            let songList: Song[] = await getSongsForMultipleAlbums(albumList)
            await saveSongs(songList)

            //Set "modified" timestamp
            await store.set('lastSync', new Date().getTime())

            //Retrieve the updated lists
            refetchArtists()
            refetchAlbums()

            //Finish sync
            //setSyncStatus(0)
          }
        }
      }
    }
    sync()
  }, [])

  async function triggerSync() {
    setSyncStatus(1)
    //TODO: Put code in reusable function
    let libraries = await store.get('libraries') as UserLibrary[]
      for (const library of libraries) {
        if(library.type === 'remote'){
          let modifiedArtists = await getIndexes(library, true)
          console.log('Modified Artists: ', modifiedArtists)
          if(modifiedArtists.length > 0){
            setSyncStatus(1)
            //Save the modified artists to the database (any new artists)
            await saveModifiedArtists(modifiedArtists)
            //TODO: If "albumCount" is 0, should we delete from db?

            //Grab albums for each artist
            let albumList: Album[] = await getAlbumsForMultipleArtists(modifiedArtists)
            await saveAlbums(albumList)

            //Grab songs for each album
            let songList: Song[] = await getSongsForMultipleAlbums(albumList)
            await saveSongs(songList)

            //Set "modified" timestamp
            await store.set('lastSync', new Date().getTime())

            //Retrieve the updated lists
            refetchArtists()
            refetchAlbums()

            //Finish sync
            setSyncStatus(0)
          }
        }
      }
    setSyncStatus(0)
  }

  async function selectAlbum(albumId: string) {
    console.log('Selected Album: ', albumId)
    setSongList(await getAlbumDetail(albumId))
  }

  function navigateToCurrentlyPlayingAlbum(albumId: string) {
    selectAlbum(albumId)
    setSelectedAlbumArtist(nowPlaying?.artist)
  }
  
  return (
    <div className={`flex flex-col w-full h-screen max-h-screen`}>
      <Header syncStatus={syncStatus} initiateSync={async () => triggerSync()}/>
      <ResizablePanelGroup className={`flex-1`} direction="horizontal">

        <ResizablePanel minSize={20}>
          <ArtistSection artistList={artistList} selectedArtist={selectedArtist} setSelectedArtist={setSelectedArtist} />
        </ResizablePanel>

        <ResizableHandle className={`dark:bg-white border-[1px] dark:border-white`}/>

        <ResizablePanel minSize={20} defaultSize={60}>
          <AlbumSection albums={albums} selectedArtist={selectedArtist} onAlbumSelected={selectAlbum} setSelectedAlbumArtist={setSelectedAlbumArtist}/>
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