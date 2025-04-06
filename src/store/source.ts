import type { Response } from '@/types/Response'
import { useIDBKeyval } from '@vueuse/integrations/useIDBKeyval.mjs'
import ky from 'ky'
import { nanoid } from 'nanoid'
import { defineStore } from 'pinia'

export interface Source {
  name: string
  url: string
  collections: Array<{
    id: string
    name: string
    author: {
      name: string
    }
    license: {
      title: string
    }
    total: number
  }>
}

export const useSourceStore = defineStore('source', () => {
  const { data: sourcesObj } = useIDBKeyval<Record<string, Source>>('sources', {})

  const selectedSourceId = useLocalStorage('selectedSource', '')
  const selectedSource = computed<Source | null>(() => sourcesObj.value[selectedSourceId.value])

  const addSource = async (source: Source) => {
    const id = nanoid()

    sourcesObj.value[id] = {
      ...toRaw(source),
    }

    return id
  }

  const removeSource = async (id: string) => {
    if (sourcesObj.value[id]) {
      delete sourcesObj.value[id]
    }
  }

  const isValidSourceUrl = async (url: string) => {
    try {
      const fullUrl = new URL('/collections', url)

      const response = await ky.get(fullUrl)

      if (!response.ok) {
        return false
      }

      const data = await response.json<Response['/collections']>()

      if (Object.keys(data).length > 0) {
        return true
      }
      else {
        return false
      }
    }
    catch {
      return false
    }
  }

  return {
    sources: sourcesObj,

    selectedSourceId,
    selectedSource,

    addSource,
    removeSource,

    isValidSourceUrl,
  }
})
