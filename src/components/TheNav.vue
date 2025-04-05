<script setup lang="ts">
import { useBaseStore } from '@/store/base'

const baseStore = useBaseStore()

const availableSources = computed(() => Object.entries(baseStore.sources).map(([name, url]) => ({
  label: name,
  value: url,
})))

const availableCollections = computed(() => Object.entries(baseStore.collections).map(([key]) => {
  return {
    label: key,
    value: key,
  }
}))
</script>

<template>
  <n-layout-sider>
    <div class="h-full overflow-hidden">
      <n-h2 class="px-4 py-6 flex items-center justify-center gap-2 m-0!">
        <n-icon class="ico-mdi-emoticon-poop" />
        <span>Iconify Catalog</span>
      </n-h2>

      <n-divider class="m-0!" />

      <div class="p-4">
        <n-input-group>
          <n-select v-model:value="baseStore.source" :options="availableSources" />
          <AddSourceModal
            @add-source="(source) => {
              baseStore.sources[source.name] = source.url
              baseStore.source = source.name
            }"
          />
        </n-input-group>
      </div>

      <n-divider class="m-0!" />

      <n-scrollbar>
        <div class="flex-grow">
          <template v-for="availableCollection in availableCollections" :key="availableCollection.value">
            <CollectionButton
              :collection="availableCollection.value"
              :active="availableCollection.value === baseStore.collection"
            />
            <n-divider class="m-0!" />
          </template>
        </div>
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>
