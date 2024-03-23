import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { PiQueueFill } from 'react-icons/pi';
import { CgLoadbarSound } from "react-icons/cg";
import { DropdownMenuContent } from '../ui/dropdown-menu';
import { Song } from '@/types/metadata';
import CoverArt from './CoverArt';
import { convertFileSrc } from '@tauri-apps/api/core';
import { ScrollArea } from '../ui/scroll-area';
import { FaTrash } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { Dispatch, SetStateAction } from 'react';

interface QueueMenuProps {
  nowPlayingId: string | undefined
  coverArtPath: string
  queue: Song[] | undefined
  setPlayQueue: Dispatch<SetStateAction<Song[] | undefined>>
  onSongSelected: (song: Song) => void
}

export default function QueueMenu({ nowPlayingId, coverArtPath, queue, onSongSelected, setPlayQueue } : QueueMenuProps) {

  //TODO: Implement drag and drop reordering of queue

  function removeFromQueue(songId: string) {
    setPlayQueue(queue?.filter(song => song.id !== songId))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger><PiQueueFill className={`p-2 dark:hover:text-slate-200`} size={48} /></DropdownMenuTrigger>
      <DropdownMenuContent>
        { queue && queue.length > 0 ? (
          <ScrollArea className={`w-96 h-[36rem]`}>
            <div className={`flex flex-col`}>
              {queue.map((song) => {
                return (
                  <div className={`flex flex-row items-center mr-2`}>
                    <button className={`px-2 cursor-pointer flex items-center hover:text-slate-200`}>
                      <MdDragIndicator size={24} className={`mr-auto self-center`} />
                    </button>
                    <button key={song.id} className={`flex-1 p-2 px-2 flex flex-row items-center hover:bg-slate-700/90 ${song.id === nowPlayingId}`} onClick={() => onSongSelected(song)}>
                      {/* Show art and track info */}
                      <CoverArt className={`w-14 h-14`} src={convertFileSrc(`${coverArtPath}/${song?.albumId}.png`)} fallbackSrc={"https://via.placeholder.com/56"} alt="album cover" />
                      <div className={`flex flex-col ml-2 mr-2 text-left`}>
                        <span className={`text-sm`}>{song.title}</span>
                        <span className={`text-xs dark:text-slate-200/90`}>{song.artist}</span>
                      </div>
                      {/* Show play icon if song is currently playing, else let user remove from queue */}
                    </button>
                    <div className={`ml-auto`}>
                      {song.id === nowPlayingId ? (
                        <CgLoadbarSound size={32} />
                      ) :
                        <button className={`flex items-center hover:text-slate-200`}>
                          <FaTrash size={16} onClick={() => removeFromQueue(song.id)} className={`mx-2`} />
                        </button>
                        
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className={`p-2`}>Queue is empty.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}