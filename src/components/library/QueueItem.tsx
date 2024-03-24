import { convertFileSrc } from '@tauri-apps/api/core';
import { Song } from '@/types/metadata'
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities';
import { CgLoadbarSound } from 'react-icons/cg'
import { FaTrash } from 'react-icons/fa'
import { MdDragIndicator } from 'react-icons/md'
import CoverArt from './CoverArt'

interface QueueItemProps {
  song: Song
  nowPlayingId: string | undefined
  coverArtPath: string
  onSongSelected: (song: Song) => void
  removeFromQueue: (songId: string) => void
}

export default function QueueItem({ song, nowPlayingId, coverArtPath, onSongSelected, removeFromQueue }: QueueItemProps) {

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: song.id })
  const style = {transform: CSS.Transform.toString(transform), transition};

  return (
    <div className={`flex flex-row items-center mr-2`} ref={setNodeRef} style={style}>
      <button className={`px-2 cursor-pointer flex items-center hover:text-slate-200`} {...listeners} {...attributes}>
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
}
