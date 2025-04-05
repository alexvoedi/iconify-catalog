<script setup lang="ts">
import { useBaseStore } from '@/store/base'

const props = defineProps<{
  collection: string
  active?: boolean
}>()

const baseStore = useBaseStore()

const collectionData = computed(() => baseStore.collectionMap[props.collection])

const variant = computed(() => props.active ? 'primary' : 'default')
</script>

<template>
  <button
    v-if="collectionData"
    class="w-full px-4 h-20 flex flex-col items-start justify-center gap-2 transition"
    hover="bg-true-gray-900"
    @click="baseStore.collection = baseStore.collection === collection ? '' : collection"
  >
    <n-text :type="variant" class="text-xl">
      {{ collectionData.title }}
    </n-text>

    <n-text :type="variant" class="opacity-75 text-xs">
      {{ collectionData.total }} icons
    </n-text>
  </button>
</template>
