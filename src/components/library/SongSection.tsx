import { ScrollArea } from '../ui/scroll-area'

export default function SongSection() {

  //TODO: Temp - to remove
  const songs = []
  for (let i = 0; i < 100; i++) {
    songs.push(`Song ${i}`)
  } 
  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Songs</h2>
        <ScrollArea className={`w-full px-4`}>
          {songs.map((song) => {
            return <div key={song} className={`p-1`}>{song}</div>
          })}
        </ScrollArea>
      </div>
    </div>
  )
}