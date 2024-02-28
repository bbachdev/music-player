import { ScrollArea } from '../ui/scroll-area'

export default function ArtistSection() {

  //TODO: Temp - to remove
  const artists = []
  for (let i = 0; i < 100; i++) {
    artists.push(`Artist ${i}`)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Artists</h2>
        <ScrollArea className={`w-full px-4`}>
          {artists.map((artist) => {
            return <div key={artist} className={`p-1`}>{artist}</div>
          })}
        </ScrollArea>
      </div>
    </div>
  )
}