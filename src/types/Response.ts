import type { IconifyIcon, IconifyInfo, IconifyJSON } from '@iconify/types'

export interface Response {
  '/collections': Record<string, IconifyInfo>

  '/collection': {
    aliases?: Record<string, string>
    categories?: Record<string, string>
    chars?: Record<string, string>
    hidden?: string[]
    prefix: string
    title: string
    total: number
    uncategorized: string[]
  }

  '/<prefix>.json': {
    prefix: string
    aliases: Record<string, string>
    width: number
    height: number
    icons: Record<string, IconifyIcon>
  } & IconifyJSON

  '/<prefix>/<icon>.svg': string
}
