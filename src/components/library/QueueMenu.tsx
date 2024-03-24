import { DropdownMenu, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { PiQueueFill } from 'react-icons/pi';
import { DropdownMenuContent } from '../ui/dropdown-menu';
import { Song } from '@/types/metadata';
import { ScrollArea } from '../ui/scroll-area';
import { Dispatch, SetStateAction } from 'react';
import {restrictToVerticalAxis, restrictToWindowEdges} from '@dnd-kit/modifiers';

import {DndContext, DragEndEvent} from '@dnd-kit/core';
import {SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import QueueItem from './QueueItem';

interface QueueMenuProps {
  nowPlayingId: string | undefined
  coverArtPath: string
  queue: Song[] | undefined
  setPlayQueue: Dispatch<SetStateAction<Song[] | undefined>>
  onSongSelected: (song: Song) => void
}

export default function QueueMenu({ nowPlayingId, coverArtPath, queue, onSongSelected, setPlayQueue } : QueueMenuProps) {

  //TODO: Implement drag and drop reordering of queue
  function reorderQueue(e: DragEndEvent) {
    if(!e.over) return

    if(e.active.id !== e.over.id) {
      setPlayQueue((prevQueue) => {
        if(!prevQueue) return
        const newQueue = [...prevQueue]
        const fromIndex = prevQueue.findIndex(song => song.id === e.active.id)
        const toIndex = prevQueue.findIndex(song => song.id === e.over!.id)
        const [movedSong] = newQueue.splice(fromIndex, 1)
        newQueue.splice(toIndex, 0, movedSong)
        return newQueue
      })
    }
  }

  function removeFromQueue(songId: string) {
    console.log("Delete")
    setPlayQueue(queue?.filter(song => song.id !== songId))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger><PiQueueFill className={`p-2 dark:hover:text-slate-200`} size={48} /></DropdownMenuTrigger>
      <DropdownMenuContent>
        { queue && queue.length > 0 ? (
          <ScrollArea className={`w-96 h-[36rem]`}>
            <DndContext onDragEnd={reorderQueue} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
              <SortableContext items={queue} strategy={verticalListSortingStrategy}>
                <div className={`flex flex-col`}>
                  {queue.map((song) => {
                    return (
                      <QueueItem key={song.id} song={song} nowPlayingId={nowPlayingId} coverArtPath={coverArtPath} onSongSelected={onSongSelected} removeFromQueue={removeFromQueue} />
                    )
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </ScrollArea>
        ) : (
          <div className={`p-2`}>Queue is empty.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}