export default function SongSection() {

  //TODO: Temp - to remove
  const songs = []
  // for (let i = 0; i < 100; i++) {
  //   songs.push(`Song ${i}`)
  // } 
  return (
    <div className={`max-h-full`}>
      <h2>Songs</h2>
      <ul>
        {songs.map((song) => {
          return <li key={song}>{song}</li>
        })}
      </ul>
    </div>
  )
}