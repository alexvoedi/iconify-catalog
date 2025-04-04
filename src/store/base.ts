import type { RemovableRef } from '@vueuse/core'
import ky from 'ky'
import { defineStore } from 'pinia'

const baseUrl = import.meta.env.VITE_BASE_URL

type Collections = Record<string, {
  name: string
  author: {
    name: string
  }
  licence: {
    title: string
  }
  total: number
}>

interface Collection {
  prefix: string
  total: number
  title: string
  uncategorized: string[]
}

type CollectionMap = Record<string, Collection>

type IconMap = Record<string, Record<string, string>>

interface BaseStore {
  collections: RemovableRef<Collections>
  collectionMap: RemovableRef<CollectionMap>
  iconMap: RemovableRef<IconMap>
}

export const useBaseStore = defineStore('base', {
  state: (): BaseStore => ({
    collections: useLocalStorage('collections', {}),
    collectionMap: useLocalStorage('collectionMap', {}),
    iconMap: useLocalStorage('iconMap', {}),
  }),
  actions: {
    async fetchCollections() {
      const url = new URL('/collections', baseUrl)

      const response = await ky.get(url).json<Collections>()

      this.collections = response
    },

    async fetchCollection(prefix: string) {
      const url = new URL(`/collection`, baseUrl)

      url.searchParams.set('prefix', prefix)

      const response = await ky.get(url).json<Collection>()

      this.collectionMap[prefix] = response
    },

    async fetchIcon(prefix: string, icon: string) {
      const url = new URL(`/${prefix}/${icon}.svg?color=white`, baseUrl)

      const response = await ky.get(url).text()

      if (!this.iconMap[prefix]) {
        this.iconMap[prefix] = {}
      }

      this.iconMap[prefix][icon] = response
    },
  },
  getters: {},
})
