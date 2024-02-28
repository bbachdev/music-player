export default function AlbumSection() {

  //TODO: Temp - to remove
  const albums = []
  // for (let i = 0; i < 100; i++) {
  //   albums.push(`Album ${i}`)
  // }

  return (
    <div className={`w-full flex flex-col max-h-full`}>
      <h2 className={`self-start`}>Albums</h2>
      <div className={`albumGrid w-full px-2`}>
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
    </div>
  )
}