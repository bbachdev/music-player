export type AlbumArtist = {
  id: string
  name: string
  coverArt: string
}

export type Album = {
  id: string
  parent: string
  album: string
  title: string
  name: string
  isDir: boolean
  coverArt: string
  songCount: number
  created: Date
  duration: number
  playCount: number
  artistId: string
  artist: string
  year: number
  genre: string
}

export type Song = {
  id: string
  parent: string
  title: string
  isDir: boolean
  isVideo: boolean
  type: string
  albumId: string
  album: string
  artist: string
  coverArt: string
  duration: number
  bitRate: number
  track: number
  year: number
  genre: string
  size: number
  discNumber: number
  suffix: string
  contentType: string
  path: string
}