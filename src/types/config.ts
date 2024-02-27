export type Config = {
  theme: `light` | `dark`
  accentColor: string
  libraries: Library[]
}

export type Library = {
  id: string
  name: string
  path: never
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
  password: string
}