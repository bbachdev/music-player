import { Song } from '@/types/metadata';
import { useEffect, useRef, useState } from 'react';

const DEFAULT_VOLUME = 65;
//Progress color for input range sliders
const PROGRESS_COLOR = '#588364'

interface NowPlayingProps {
  nowPlaying: Song | undefined
  playQueue: Song[] | undefined
}

export default function NowPlaying({ nowPlaying, playQueue }: NowPlayingProps) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [volume, setVolume] = useState(DEFAULT_VOLUME);
  const [savedVolume, setSavedVolume] = useState(DEFAULT_VOLUME);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const volumeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    //Call stream endpoint, and set audio source to the stream
    
  }, [nowPlaying]);
  
  return (
    <div className={`p-4 flex dark:bg-slate-800 border-t-2 dark:border-white`}>
      Now Playing
    </div>
  )
}