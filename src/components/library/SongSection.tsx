import { Song } from '@/types/metadata'
import { ScrollArea } from '../ui/scroll-area'
import { useEffect, useState } from 'react'

interface SongSectionProps {
  songs: Song[]
  setPlayQueue: (songs: Song[]) => void
  setNowPlaying: (song: Song) => void
}

export default function SongSection({ songs, setPlayQueue, setNowPlaying } : SongSectionProps) {
  const [header, setHeader] = useState('Songs')
  const [subHeader, setSubHeader] = useState('')

  useEffect(() => {
    if(songs.length > 0){
      setHeader(songs[0].album)
      //TODO: Use album artist instead (pull in from album object)
      setSubHeader(songs[0].artist)
    }
  }, [songs])

  function playSong(song: Song) {
    setPlayQueue(songs)
    setNowPlaying(song)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <div className={`p-2`}>
          <h2 className={`text-2xl`}>{header}</h2>
          <p className={`pt-1 text-sm text-slate-200`}>{subHeader}</p>
        </div>
        
        <ScrollArea className={`w-full`}>
          <div className={`flex flex-col text-left`}>
            {songs.map((song) => {
              return <button key={song.id} className={`p-2 text-left dark:hover:bg-slate-700/90`} onClick={() => playSong(song)}><span className={`p-1`}>{song.track} - {song.title}</span></button>
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}