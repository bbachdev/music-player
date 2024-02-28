export type Config = {
  theme: `light` | `dark`
  accentColor: string
  libraries: Library[]
  discordRichPresence: boolean
}

export type Library = {
  id: string
  name: string
  type: `remote`
  connectionDetails: ConnectionDetails
} | {
  id: string
  name: string
  path: string
  type: `local`
  connectionDetails?: never
}

export type ConnectionDetails = {
  host: string
  port?: number
  username: string
  md5: string
  salt: string
}