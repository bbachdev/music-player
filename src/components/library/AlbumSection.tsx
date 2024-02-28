import { ScrollArea } from '../ui/scroll-area'

export default function AlbumSection() {

  //TODO: Temp - to remove
  const albums = []
  for (let i = 0; i < 100; i++) {
    albums.push(`Album ${i}`)
  }

  return (
    <div className={`h-full`}>
      <div className={`flex flex-col h-full w-full`}>
        <h2 className={`p-2`}>Albums</h2>
        <ScrollArea className={`px-4`}>
          <div className={`albumGrid w-full`}>
            {albums.map((album) => {
              return <div key={album} className={`w-fit`}>
              <img src="https://via.placeholder.com/120" alt="album cover" />
              <div className={`flex flex-col`}>
                <p>{album}</p>
                <p>Artist Name</p>
              </div>
            </div>
            })}
          </div>
          
        </ScrollArea>
      </div>
    </div>
  )
}