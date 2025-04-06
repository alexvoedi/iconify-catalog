<script setup lang="ts">
import { useCollectionStore } from '@/store/collection'

const props = defineProps<{
  collection: {
    id: string
    name: string
    author: {
      name: string
    }
    license: {
      title: string
    }
    total: number
  }
}>()

const collectionStore = useCollectionStore()

const collection = computed(() => {
  try {
    return collectionStore.getCollectionByPrefix(props.collection.id)
  }
  catch {
    return null
  }
})

const variant = computed(() =>
  collectionStore.selectedCollectionId === collection.value?.id
    ? 'primary'
    : 'default')

function selectCollection() {
  if (!collection.value)
    return

  collectionStore.selectedCollectionId = collectionStore.selectedCollectionId === collection.value.id
    ? ''
    : collection.value.id
}
</script>

<template>
  <button
    v-if="collection"
    class="w-full px-4 h-20 flex flex-col items-start justify-center gap-2 transition"
    hover="bg-true-gray-900"
    @click="selectCollection"
  >
    <n-text :type="variant" class="text-xl">
      {{ collection.name }}
    </n-text>

    <n-text :type="variant" class="opacity-75 text-xs">
      {{ collection.total }} icons
    </n-text>
  </button>
</template>
