<script setup lang="ts">
import { useSourceStore } from '@/store/source'

const sourceStore = useSourceStore()
</script>

<template>
  <n-layout-sider>
    <div class="h-full overflow-hidden">
      <n-h2 class="px-4 py-6 flex items-center justify-center gap-2 m-0!">
        <n-icon class="ico-mdi-emoticon-poop" />
        <span>Iconify Catalog</span>
      </n-h2>

      <n-divider class="m-0!" />

      <SourceSelector />

      <n-divider class="m-0!" />

      <n-scrollbar>
        <div v-if="sourceStore.selectedSource" class="flex-grow">
          <template v-for="collection in sourceStore.selectedSource.collections" :key="collection.id">
            <CollectionButton
              :collection="collection"
            />
            <n-divider class="m-0!" />
          </template>
        </div>
      </n-scrollbar>
    </div>
  </n-layout-sider>
</template>
