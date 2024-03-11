import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { PiQueueFill } from 'react-icons/pi';
import { CgLoadbarSound } from "react-icons/cg";
import { DropdownMenuContent } from '../ui/dropdown-menu';
import { Song } from '@/types/metadata';
import CoverArt from './CoverArt';
import { convertFileSrc } from '@tauri-apps/api/core';

interface QueueMenuProps {
  nowPlayingId: string | undefined
  coverArtPath: string
  queue: Song[] | undefined
  onSongSelected: (song: Song) => void
}

export default function QueueMenu({ nowPlayingId, coverArtPath, queue, onSongSelected } : QueueMenuProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger><PiQueueFill className={`p-2 dark:hover:text-slate-200`} size={48} /></DropdownMenuTrigger>
      <DropdownMenuContent>
        { queue && queue.length > 0 ? (
          <div className={`flex flex-col w-96`}>
            {queue.map((song) => {
              return (
                <button key={song.id} className={`p-2 px-4 flex flex-row items-center hover:bg-slate-700/90 ${song.id === nowPlayingId}`} onClick={() => onSongSelected(song)}>
                  {/* Show art and track info */}
                  <CoverArt className={`w-14 h-14`} src={convertFileSrc(`${coverArtPath}/${song?.albumId}.png`)} fallbackSrc={"https://via.placeholder.com/56"} alt="album cover" />
                  <div className={`flex flex-col ml-2 mr-2 text-left`}>
                    <span className={`text-md`}>{song.title}</span>
                    <span className={`text-xs dark:text-slate-200/90`}>{song.artist}</span>
                  </div>
                  {/* Show play icon if song is currently playing */}
                  {song.id === nowPlayingId && <CgLoadbarSound size={32} className={`ml-auto self-center`}/>}
                </button>
              )
            })}
          </div>
        ) : (
          <div className={`p-2`}>Queue is empty.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}