<script setup lang="ts">
import { useBaseStore } from '@/store/base'

const baseStore = useBaseStore()

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
</script>

<template>
  <Collection :collection="baseStore.collection" />
</template>
