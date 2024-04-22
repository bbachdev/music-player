import { Song } from '@/types/metadata'
import { ScrollArea } from '../ui/scroll-area'
import { useEffect, useState } from 'react'
import { CgLoadbarSound } from "react-icons/cg";

interface SongSectionProps {
  songs: Song[]
  setPlayQueue: (songs: Song[]) => void
  setNowPlaying: (song: Song) => void
  nowPlaying: Song | undefined
  selectedAlbumArtist: string | undefined
}

export default function SongSection({ songs, setPlayQueue, setNowPlaying, nowPlaying, selectedAlbumArtist } : SongSectionProps) {
  const [header, setHeader] = useState('Songs')
  const [subHeader, setSubHeader] = useState('')
  const [totalDuration, setTotalDuration] = useState<string | undefined>()

  useEffect(() => {
    if(songs.length > 0){
      setHeader(songs[0].album)
      let subHeader: string = ''
      if(selectedAlbumArtist) {
        subHeader = `${selectedAlbumArtist}`
        if(songs[0].year) subHeader += ` - (${songs[0].year.toString()})`
        setSubHeader(subHeader)
        let durationSeconds = songs.reduce((acc, song) => acc + song.duration, 0)
        setTotalDuration(new Date(durationSeconds * 1000).toISOString().slice(11, 19).replace(/^00:/, ''))
      }else {
        if(songs[0].year) setSubHeader(`(${songs[0].year.toString()})`)
      }
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
              return (
                <button key={song.id} className={`p-2 py-1 text-left dark:hover:bg-slate-700/90 ${nowPlaying?.id === song.id ? 'bg-slate-700/90' : '' }`} onClick={() => playSong(song)}>
                  <div className={`p-1 flex flex-row`}>
                    <span className={`text-xl w-5 mr-4`}>{song.track}</span>
                    <div className={`flex flex-col`}>
                      <span className={`text-md`}>{song.title}</span>
                      <span className={`text-xs dark:text-slate-200/90`}>{song.artist}</span>
                    </div>
                    {nowPlaying?.id === song.id && <span className={`ml-auto mr-8 self-center`}><CgLoadbarSound size={32}/></span>}
                  </div>
                </button>
              )
            })}
          </div>
        </ScrollArea>
        <div className={`mt-auto p-4`}>
          { songs.length > 0 && <> <span className={`text-sm text-slate-200`}>{songs.length} {(songs.length === 1) ? `Track` : `Tracks`} - {totalDuration}</span></> }
        </div>
      </div>
    </div>
  )
}