<script setup lang="ts">
import { useBaseStore } from '@/store/base'

const baseStore = useBaseStore()

const collection = useLocalStorage<string>('collection', '')

watch(() => baseStore.source, async () => {
  if (!baseStore.source) {
    return
  }

  await baseStore.fetchCollections()

  await Promise.all(Object.keys(baseStore.collections).map(async (prefix) => {
    await baseStore.fetchCollection(prefix)
  }))
}, {
  immediate: true,
})

const availableSources = computed(() => Object.entries(baseStore.sources).map(([name, url]) => ({
  label: name,
  value: url,
})))

const availableCollections = computed(() => Object.keys(baseStore.collections).map(collection => ({
  label: collection,
  value: collection,
})))
</script>

<template>
  <div class="p-8  items-center text-white">
    <n-h1>Icon Search</n-h1>

    <div class="flex flex-col justify-center gap-4">
      <n-input-group>
        <n-select v-model:value="baseStore.source" :options="availableSources" size="large" />
        <AddSourceModal
          @add-source="(source) => {
            baseStore.sources[source.name] = source.url
            baseStore.source = source.name
          }"
        />
      </n-input-group>

      <n-select v-model:value="collection" :options="availableCollections" size="large" />
    </div>

    <n-divider />

    <Collection v-if="collection" :collection="collection" />
  </div>
</template>
