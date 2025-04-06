import type { Response } from '@/types/Response'
import { toArray } from '@/utils/toArray'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval.mjs'
import ky from 'ky'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'
import { useSourceStore } from './source'

export interface Collection {
  sourceId: string

  provider: string
  prefix: string
  name: string
  total: number
  uncategorized: string[]
}

export const useCollectionStore = defineStore('collection', () => {
  const sourceStore = useSourceStore()

  const { data: collectionsObj } = useIDBKeyval<Record<string, Collection>>('collections', {})

  const selectedCollectionId = useLocalStorage('selectedCollection', '')
  const selectedCollection = computed<Collection | null>(() => collectionsObj.value[selectedCollectionId.value])

  const addCollection = async (sourceId: string, collection: Omit<Collection, 'sourceId'>) => {
    const id = nanoid()

    collectionsObj.value[id] = {
      ...toRaw(collection),
      sourceId,
    }
  }

  const removeCollection = async (id: string) => {
    if (collectionsObj.value[id]) {
      delete collectionsObj.value[id]
    }
  }

  const loadCurrentCollections = async () => {
    if (!sourceStore.selectedSource)
      return

    const fullUrl = new URL('/collection', sourceStore.selectedSource.url)

    await Promise.all(sourceStore.selectedSource.collections.map(async (collection) => {
      const response = await ky.get(fullUrl, {
        searchParams: {
          prefix: collection.id,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to load collections')
      }

      const data = await response.json<Response['/collection']>()

      addCollection(sourceStore.selectedSourceId, {
        provider: data.prefix,
        prefix: data.prefix,
        name: data.title,
        total: data.total,
        uncategorized: data.uncategorized,
      })
    }))
  }

  const getCollectionsBySource = (sourceId: string) => {
    const collection = toArray(collectionsObj.value).filter(collection => collection.sourceId === sourceId)

    if (!collection) {
      throw new Error('Collection not found')
    }

    return collection
  }

  const getCollectionByPrefix = (prefix: string) => {
    const collections = toArray(collectionsObj.value)

    const collection = collections.find(collection => collection.prefix === prefix)

    if (!collection) {
      throw new Error('Collection not found')
    }

    return collection
  }

  const getIcons = (collectionId: string) => {
    const collection = collectionsObj.value[collectionId]

    if (!collection)
      return []

    return collection.uncategorized
  }

  watch(() => sourceStore.selectedSourceId, async (sourceId) => {
    if (!sourceId)
      return

    await loadCurrentCollections()
  }, {
    immediate: true,
  })

  return {
    collections: collectionsObj,

    selectedCollectionId,
    selectedCollection,

    addCollection,
    removeCollection,

    getCollectionsBySource,
    getCollectionByPrefix,
    getIcons,
  }
})
