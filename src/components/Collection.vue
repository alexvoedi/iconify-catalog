<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'
import { createRankedGroups } from '@/utils/createRankedGroups'
import { toArray } from '@/utils/toArray'
import { addAPIProvider } from '@iconify/vue'
import Fuse from 'fuse.js'

const collectionStore = useCollectionStore()

const icons = computed(() => collectionStore.getIcons(collectionStore.selectedCollectionId))

const fuse = new Fuse<string>(
  icons.value,
  {
    keys: ['name'],
    threshold: 0.3,
    ignoreLocation: true,
  },
)

const search = ref('')
const categories = ref<string[]>([])

const filteredIcons = computed(() => {
  let filteredIcons = [...icons.value]

  if (categories.value.length > 0) {
    filteredIcons = filteredIcons.filter((name) => {
      return categories.value.some(category => name.includes(category))
    })
  }

  if (search.value) {
    const result = fuse.search(search.value)

    filteredIcons = filteredIcons.filter((name) => {
      return result.some(item => item.item === name)
    })
  }

  return filteredIcons
})

const availableCategories = computed(() => createRankedGroups(icons.value))

onMounted(() => {
  toArray(collectionStore.collections).forEach((collection) => {
    addAPIProvider(collection.provider, {
      resources: ['https://icons.ipen.eon.com'],
    })
  })
})
</script>

<template>
  <div class="grid gap-6">
    <n-input v-model:value="search" placeholder="Search for icons" :clearable="true" size="large">
      <template #prefix>
        <n-icon class="ico-mdi-magnify" />
      </template>
    </n-input>

    <div
      class="text-white flex gap-3 flex-wrap"
    >
      <n-tag
        v-for="item in availableCategories"
        :key="item[0]"
        :checked="categories.includes(item[0])"
        checkable
        round
        bordered
        strong
        size="large"
        @update:checked="(checked) => {
          if (checked) {
            categories.push(item[0])
          }
          else {
            categories = categories.filter(category => category !== item[0])
          }
        }"
      >
        {{ item[0] }}
      </n-tag>
    </div>

    <div
      v-if="collectionStore.selectedCollection"
      class="icon-grid items-center gap-3 justify-center items-center"
    >
      <div
        v-for="icon in filteredIcons" :key="icon"
        class="flex flex-grow items-center gap-2 max-w-400px"
      >
        <Icon :provider="collectionStore.selectedCollection.provider" :prefix="collectionStore.selectedCollection.prefix" :name="icon" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
</style>
