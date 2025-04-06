<script setup lang="ts">
import { useSourceStore } from '@/store/source'
import { toArray } from '@/utils/toArray'

const sourceStore = useSourceStore()

const availableSources = computed(() => toArray(sourceStore.sources).map(source => ({
  label: source.name,
  value: source.id,
})))
</script>

<template>
  <div class="p-4">
    <n-input-group>
      <n-select v-model:value="sourceStore.selectedSourceId" :options="availableSources" />
      <AddSourceModal />
    </n-input-group>
  </div>
</template>
