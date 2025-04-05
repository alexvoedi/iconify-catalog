import type { Collection, CollectionMap } from '@/types/Collection'
import type { CollectionCategories } from '@/types/CollectionCategories'
import type { Collections } from '@/types/Collections'
import type { IconMap } from '@/types/IconMap'
import type { RemovableRef } from '@vueuse/core'
import { createRankedGroups } from '@/utils/createRankedGroups'
import ky from 'ky'
import { defineStore } from 'pinia'

interface BaseStore {
  sources: RemovableRef<Record<string, string>>
  source: RemovableRef<string>
  collections: RemovableRef<Collections>
  collection: RemovableRef<string>
  collectionMap: RemovableRef<CollectionMap>
  iconMap: RemovableRef<IconMap>
  collectionCategories: RemovableRef<CollectionCategories>
}

export const useBaseStore = defineStore('base', {
  state: (): BaseStore => ({
    sources: useLocalStorage('sources', {}),
    source: useLocalStorage('source', ''),
    collections: useLocalStorage('collections', {}),
    collection: useLocalStorage('collection', ''),
    collectionMap: useLocalStorage('collectionMap', {}),
    iconMap: useLocalStorage('iconMap', {}),
    collectionCategories: useLocalStorage('collectionCategories', {}),
  }),
  actions: {
    async fetchCollections() {
      const url = new URL('/collections', this.sources[this.source])

      const response = await ky.get(url).json<Collections>()

      this.collections = response
    },

    async fetchCollection(prefix: string) {
      const url = new URL(`/collection`, this.sources[this.source])

      url.searchParams.set('prefix', prefix)

      const response = await ky.get(url).json<Collection>()

      this.collectionMap[prefix] = response
    },

    async fetchIcon(prefix: string, icon: string) {
      const url = new URL(`/${prefix}/${icon}.svg?color=white`, this.sources[this.source])

      const response = await ky.get(url).text()

      if (!this.iconMap[prefix]) {
        this.iconMap[prefix] = {}
      }

      this.iconMap[prefix][icon] = response
    },

    calculateCategories(prefix: string) {
      const flatIconList = this.collectionMap[prefix].uncategorized

      this.collectionCategories[prefix] = createRankedGroups(flatIconList)
    },
  },
  getters: {},
})
