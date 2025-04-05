<script setup lang="ts">
import { useBaseStore } from '@/store/base'
import { createRankedGroups } from '@/utils/createRankedGroups'
import Fuse from 'fuse.js'

const props = defineProps<{
  collection: string
}>()

const baseStore = useBaseStore()

const collectionData = computed(() => baseStore.collectionMap[props.collection])
const icons = computed(() => baseStore.iconMap[props.collection] ?? {})

const fuse = new Fuse<string>(
  Object.keys(icons.value),
  {
    keys: ['name'],
    threshold: 0.3,
    ignoreLocation: true,
  },
)

watch(() => props.collection, async () => {
  const iconArray = collectionData.value?.uncategorized

  if (!iconArray)
    return

  await Promise.all(iconArray.map(async (icon) => {
    await baseStore.fetchIcon(collectionData.value.prefix, icon)

    fuse.add(icon)
  }))

  baseStore.calculateCategories(collectionData.value.prefix)
}, {
  immediate: true,
})

const search = ref('')
const categories = ref<string[]>([])

const filteredIcons = computed(() => {
  const iconMap: Record<string, string> = {}

  if (search.value) {
    fuse.search(search.value).forEach(({ item: name }) => {
      iconMap[name] = icons.value[name]
    })
  }
  else {
    Object.keys(icons.value).forEach((name) => {
      iconMap[name] = icons.value[name]
    })
  }

  if (categories.value.length > 0) {
    Object.keys(iconMap).forEach((name) => {
      if (!categories.value.some(category => name.includes(category))) {
        delete iconMap[name]
      }
    })
  }

  return iconMap
})

const availableCategories = computed(() => createRankedGroups(Object.keys(icons.value)))
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
      class="icon-grid items-center gap-3 justify-center items-center"
    >
      <div
        v-for="([name, svg]) in Object.entries(filteredIcons)" :key="name"
        class="flex flex-grow items-center gap-2 max-w-400px"
      >
        <Icon :prefix="collectionData.prefix" :name="name" :svg="svg" />
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
