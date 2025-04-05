export interface Collection {
  prefix: string
  total: number
  title: string
  uncategorized: string[]
}

export type CollectionMap = Record<string, Collection>
