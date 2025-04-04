<script setup lang="ts">
import { useBaseStore } from '@/store/base'
import Fuse from 'fuse.js'
import { useMessage } from 'naive-ui'

const message = useMessage()
const baseStore = useBaseStore()
const search = ref('')

const fuse = new Fuse<{ name: string, prefix: string }>([], {
  keys: ['name'],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true,
  useExtendedSearch: true,
})

onMounted(async () => {
  await baseStore.fetchCollections()

  await Promise.all(Object.keys(baseStore.collections).map(async (prefix) => {
    await baseStore.fetchCollection(prefix)

    await Promise.all(baseStore.collectionMap[prefix].uncategorized.map(async (icon) => {
      await baseStore.fetchIcon(prefix, icon)

      fuse.add({
        name: icon,
        prefix,
      })
    }))
  }))
})

function getBackgroundColor(svg: string): string {
  if (svg.includes('fill="none"')) {
    return 'rgb(140, 140, 144)'
  }

  if (
    svg.includes('fill="white"')
    || svg.includes('fill=\'#ffffff\'') || svg.includes('fill="#ffffff"')
    || svg.includes('fill=\'#fff\'') || svg.includes('fill="#fff"')
  ) {
    return 'rgb(36, 36, 40)'
  }

  if (
    svg.includes('fill="black"')
    || svg.includes('fill=\'#000000\'') || svg.includes('fill="#000000"')
    || svg.includes('fill=\'#000\'') || svg.includes('fill="#000"')
  ) {
    return '#ddd'
  }

  return '#ccc'
}

function copyToClipboard(prefix: string, name: string) {
  navigator.clipboard.writeText(`${prefix}:${name}`)
    .then(() => {
      message.success(`
        Copied ${prefix}:${name} to clipboard
      `)
    })
    .catch(() => {
      message.error('Failed to copy')
    })
}

const filteredIcons = computed(() => {
  if (!search.value) {
    return baseStore.iconMap
  }

  const result = fuse.search(search.value)

  const filtered = result.map((item) => {
    const { prefix, name } = item.item

    return {
      prefix,
      name,
    }
  })

  const iconMap: Record<string, Record<string, string>> = {}

  filtered.forEach((item) => {
    const { prefix, name } = item

    if (!iconMap[prefix]) {
      iconMap[prefix] = {}
    }

    if (!iconMap[prefix][name]) {
      iconMap[prefix][name] = baseStore.iconMap[prefix][name]
    }
  })

  return iconMap
})
</script>

<template>
  <div class="p-8 flex flex-col gap-4 justify-center items-center">
    <n-h1>Icon Search</n-h1>

    <n-input v-model:value="search" placeholder="Search for icons" :clearable="true" size="large" />
    <div
      v-for="([prefix, icons]) in Object.entries(filteredIcons)" :key="prefix"
      class="flex items-center gap-3 flex-wrap justify-center items-center"
    >
      <div v-for="([name, svg]) in Object.entries(icons)" :key="name" class="flex flex-grow items-center gap-2 max-w-400px">
        <n-tooltip :delay="200">
          <template #trigger>
            <button
              class="gap-2 p-3 w-full flex flex-col items-center justify-center rounded"
              :style="{ backgroundColor: getBackgroundColor(svg) }" @click="copyToClipboard(prefix, name)"
            >
              <div class="text-3xl" v-html="svg" />
              <div class="text-true-gray-300">
                {{ name }}
              </div>
            </button>
          </template>

          <pre>{{ prefix }}:{{ name }}</pre>
        </n-tooltip>
      </div>
    </div>
  </div>
</template>
