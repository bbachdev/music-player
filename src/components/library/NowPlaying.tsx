import { Song } from '@/types/metadata';
import { scrobble, stream } from '@/util/subsonic';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { FaCirclePlay } from "react-icons/fa6";
import { FaCirclePause } from "react-icons/fa6";
import { IoIosSkipBackward } from "react-icons/io";
import { IoIosSkipForward } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { FaVolumeMute } from "react-icons/fa";
import CoverArt from './CoverArt';
import { convertFileSrc } from '@tauri-apps/api/core';
import Spinner from '../ui/spinner';
import QueueMenu from './QueueMenu';
import { store } from '@/util/config';

const DEFAULT_VOLUME = 65;
//Progress color for input range sliders
const PROGRESS_COLOR = 'white'

interface NowPlayingProps {
  nowPlaying: Song | undefined
  setNowPlaying: Dispatch<SetStateAction<Song | undefined>>
  playQueue: Song[] | undefined
  setPlayQueue: Dispatch<SetStateAction<Song[] | undefined>>
  directToCurrentAlbum: (albumId: string) => void
}

const coverArtPath = await store.get('coverArtPath') as string

export default function NowPlaying({ nowPlaying, setNowPlaying, playQueue, directToCurrentAlbum, setPlayQueue }: NowPlayingProps) {
  const [_hasLoaded, setHasLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [savedVolume, setSavedVolume] = useState(DEFAULT_VOLUME);
  const [songLoading, setSongLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  //Loaded songs
  const [loadedSongs, setLoadedSongs] = useState<Map<string, string>>(new Map())
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //Call stream endpoint, and set audio source to the stream
    async function loadAudio() {
      if(nowPlaying){
        setSongLoading(true)
        if(audioRef.current){
          //TODO: Potentially pause/stop current audio if currently playing?
          //TODO: Can we garbage collect non-queued songs?
          let audioData;
          if(loadedSongs.has(nowPlaying.id)){
            audioData = loadedSongs.get(nowPlaying.id)
          }else{
            audioData = await stream(nowPlaying)
          }
          if(audioData) {
            loadedSongs.set(nowPlaying.id, audioData)
            audioRef.current.src = audioData
            audioRef.current.load()
            if(endReached === true){
              setEndReached(false)
              setSongLoading(false)
            }else{
              audioRef.current.play()
              setIsPlaying(true)
              setSongLoading(false)
              scrobble(nowPlaying.id)
            }
            //TODO: Move to helper function + file 
            //Grab binary data for surrounding songs in queue
            let currentIndex = playQueue?.findIndex((song) => song.id === nowPlaying.id)
            if(playQueue){
              //If index is not the first song, get the previous song
              if(currentIndex && currentIndex !== 0){
                let prevSong = playQueue[currentIndex-1]
                if(!loadedSongs.has(prevSong.id)){
                  let prevSongData = await stream(prevSong)
                  if(prevSongData){
                    loadedSongs.set(prevSong.id, prevSongData)
                  }
                }
              }
              //If index is not the last song, get the next song
              if(currentIndex && currentIndex !== playQueue?.length-1){
                let nextSong = playQueue[currentIndex+1]
                if(!loadedSongs.has(nextSong.id)){
                  let nextSongData = await stream(nextSong)
                  if(nextSongData){
                    loadedSongs.set(nextSong.id, nextSongData)
                  }
                }
              }
              setLoadedSongs(loadedSongs)
            }  
          }else{
            console.log('Error loading audio')
            setSongLoading(false)
          }
        }
      }
    }
    loadAudio()
  }, [nowPlaying]);

  useEffect(() => {
    if(volumeRef.current){
      volumeRef.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${volume}%, #ccc ${volume}%)`;
    }
  }, []);

  const onLoadedMetadata = () => {
    setHasLoaded(true);
    if (audioRef.current && progressRef.current) {
      audioRef.current.volume = volume / 100;
      //setDuration(`${Math.floor(audioRef.current.duration / 60)}:${Math.floor(audioRef.current.duration % 60)}`);
      setDuration(new Date(audioRef.current.duration * 1000).toISOString().slice(11, 19).replace(/^0+:/, ''))
      if(volumeRef.current) {
        volumeRef.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${DEFAULT_VOLUME}%, #ccc ${DEFAULT_VOLUME}%)`;
      }

      //Set to not playing once audio ends
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        if(progressRef.current){
          progressRef.current.value = '0';
          progressRef.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${progressRef.current.value}%, #ccc ${progressRef.current.value}%)`;
        }
      });

      //Update progress bar as audio plays
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current && progressRef.current) {
          //Update progress bar
          const { currentTime, duration } = audioRef.current;
          const progressPercent = (currentTime / duration) * 100;
          progressRef.current.value = progressPercent.toString();
          progressRef.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${progressRef.current.value}%, #ccc ${progressRef.current.value}%)`;
          //Update time strings
          setCurrentTime(`${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`);
        }
      });

      //Reset progress bar when audio ends
      audioRef.current.addEventListener('ended', () => {
        if (audioRef.current && progressRef.current) {
          progressRef.current.value = '0';
          setCurrentTime('0:00');
          setIsPlaying(false);

          //Load next song if it exists
          if(playQueue && playQueue[playQueue.length-1].id !== nowPlaying!.id){
            let index = playQueue.findIndex((song) => song.id === nowPlaying!.id)
            if(index !== playQueue.length-1){
              setNowPlaying(playQueue[index+1])
            }
          }else{
            //If no next song, reset to first song, but don't play
            if(playQueue && playQueue[playQueue.length-1].id === nowPlaying!.id){
              setEndReached(true)
              setNowPlaying(playQueue[0])
            }
          }   
        }
      });
      console.log("Loaded config done")
    }
  }

  const togglePlay = () => {
    if(isPlaying){
      audioRef.current?.pause()
    }else{
      audioRef.current?.play()
    }
    setIsPlaying(!isPlaying);
  }

  const skipForward = () => {
    if(playQueue && playQueue[playQueue.length-1].id !== nowPlaying?.id){
      let index = playQueue.findIndex((song) => song.id === nowPlaying?.id)
      if(index !== playQueue.length-1){
        if(isPlaying){
          audioRef.current?.pause()
        }
        setNowPlaying(playQueue[index+1])
      }
    }
  }

  const skipBackward = () => {
    if(playQueue && playQueue[0].id !== nowPlaying?.id){
      let index = playQueue.findIndex((song) => song.id === nowPlaying?.id)
      if(index > 0){
        if(isPlaying){
          audioRef.current?.pause()
        }
        setNowPlaying(playQueue[index-1])
      }else if(index === 1){
        //Just restart the song
        setNowPlaying(playQueue[0])
      }
    }
  }

  const changeVolume = (newLevel : number) => {
    if(!audioRef.current) return;
    audioRef.current.volume = newLevel / 100;
    setVolume(newLevel);
    if(newLevel === 0) {
      audioRef.current.muted = true;
    }
    else {
      audioRef.current.muted = false;
    }
    if(!volumeRef.current) return;
    volumeRef.current.value = newLevel.toString();
  }

  const toggleMute = () => {
    if(!audioRef.current) return;
    if(audioRef.current.muted) {
      audioRef.current.muted = false;
      setVolume(savedVolume);
      if(!volumeRef.current) return;
      volumeRef.current.value = savedVolume.toString();
    }
    else {
      audioRef.current.muted = true;
      setSavedVolume(volume);
      setVolume(0);
      if(!volumeRef.current) return;
      volumeRef.current.value = '0';
    }
    volumeRef.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${volumeRef.current.value}%, #ccc ${volumeRef.current.value}%)`;
  }

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!audioRef.current) return;
    const percent = Number(e.target.value) / 100;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  }

  const updateProgress = (ref : React.RefObject<HTMLInputElement>) => {
    if(ref.current) {
      const sliderValue = Number(ref.current.value);
      ref.current.style.background = `linear-gradient(to right, ${PROGRESS_COLOR} ${sliderValue}%, #ccc ${sliderValue}%)`;
    }
  }

  const queueSongSelected = (song: Song) => {
    setNowPlaying(song)
  }

  //TODO: When clicking thumbnail, make sure to broadcast change to AlbumSection
  //TODO: Seek is a bit messed up (not consistent). Find out why.
  //TODO: Hide section when NowPlaying is empty
  
  return (
    <>
      <audio ref={audioRef} onLoadedMetadata={onLoadedMetadata}>
        <source  />
        Your browser does not support the audio element.
      </audio>
      <div className={`flex flex-col dark:bg-slate-800 border-t-2 dark:border-white ${(nowPlaying) ? '' : 'hidden'}`}>
        <div className={'flex flex-row ml-2 py-1'}>
          <span className={`text-sm text-slate-200 px-2`}>{currentTime}</span>
          <input className={'w-full cursor-pointer'} ref={progressRef} type="range" step={`any`} defaultValue={0} onChange={(e) => seek(e)} onInput={() => updateProgress(progressRef)}/>
          <span className={`text-sm text-slate-200 mx-3`}>{duration}</span>
        </div>
        <div className={`p-4 pt-0 flex flex-row items-center`}>
          <div className={`relative`}>
            {songLoading && <Spinner className={`absolute left-[10px] top-[10px] z-50`} />}
            {songLoading && <div className={`absolute bg-slate-800/80 h-14 w-14`}></div>}
            <button className={`hover:opacity-60`} onClick={(nowPlaying) ? () => directToCurrentAlbum(nowPlaying?.albumId) : undefined}><CoverArt className={`w-14 h-14`} src={convertFileSrc(`${coverArtPath}/${nowPlaying?.albumId}.png`)} fallbackSrc={"https://via.placeholder.com/56"} alt="album cover" /></button>
          </div>
          
          <div className={`flex flex-col flex-1`}>
            <p className={`pl-4 font-semibold text-lg`}>{nowPlaying?.title}</p>
            <p className={`pl-4 text-sm text-slate-200`}>{nowPlaying?.artist}</p>
          </div>
          <div className={`flex flex-row items-center`}>
            <button className={`p-2 dark:hover:text-slate-200`} onClick={skipBackward}><IoIosSkipBackward size={36} /></button>
            <button className={`p-2 dark:hover:text-slate-200`} onClick={togglePlay}>{isPlaying ? <FaCirclePause size={48} /> : <FaCirclePlay size={48} />}</button>
            <button className={`p-2 dark:hover:text-slate-200`} onClick={skipForward}><IoIosSkipForward size={36} /></button>
          </div>
          <div className={`flex-1 flex gap-8`}>
              { /* Volume slider */}
              <div className={'flex flex-row space-x-2 items-center ml-auto'}>
                <div className={'flex cursor-pointer w-fit hover:text-gray-400'}>
                  {volume > 0 ?
                    <FaVolumeUp onClick={toggleMute} fontSize={'medium'} size={24}/> :
                    <FaVolumeMute onClick={toggleMute} fontSize={'medium'} size={24}/>
                  }
                </div>
                <input className={`cursor-pointer`} ref={volumeRef} type="range" defaultValue={volume} min={0} max={100} step={1} onChange={(e) => changeVolume(Number(e.target.value))} onInput={() => updateProgress(volumeRef)}/>
              </div>
            {/* <button className={`p-2 dark:hover:text-slate-200`} onClick={toggleQueueDisplay}><PiQueueFill size={36} /></button> */}
            <QueueMenu onSongSelected={queueSongSelected} nowPlayingId={nowPlaying?.id} setPlayQueue={setPlayQueue} coverArtPath={coverArtPath} queue={playQueue} />
          </div>
        </div>
      </div>
      
    </>
    
  )
}