<script setup lang="ts">
import type { Source } from '@/store/source'
import type { Response } from '@/types/Response'
import { useSourceStore } from '@/store/source'
import { toArray } from '@/utils/toArray'
import ky from 'ky'
import { useMessage } from 'naive-ui'

const sourceStore = useSourceStore()
const message = useMessage()

const show = ref(false)
const validSource = ref(false)

const newSource = ref<Source>({
  name: '',
  url: 'https://',
  collections: [],
})

const availableCollections = ref<Array<{
  id: string
  name: string
  author: {
    name: string
  }
  license: {
    title: string
  }
  total: number
}>>([])

watchDebounced(
  () => newSource.value,
  async (newValue) => {
    try {
      validSource.value = await sourceStore.isValidSourceUrl(newValue.url)

      await fetchAvailableCollections()
    }
    catch {
      validSource.value = false
    }
  },
  { debounce: 1_000, deep: true },
)

async function addSource() {
  if (!validSource.value)
    message.error('Invalid source URL')

  const id = await sourceStore.addSource(newSource.value)

  show.value = false

  sourceStore.selectedSourceId = id
}

async function fetchAvailableCollections() {
  if (!validSource.value)
    return false

  try {
    const fullUrl = new URL('/collections', newSource.value.url)

    const response = await ky.get(fullUrl)

    if (!response.ok) {
      throw new Error('Failed to fetch source collection')
    }

    const data = await response.json<Response['/collections']>()

    availableCollections.value = toArray(data)
  }
  catch (e) {
    console.error('Error fetching collections:', e)
  }
}
</script>

<template>
  <n-tooltip>
    <template #trigger>
      <n-button secondary @click="show = true">
        <template #icon>
          <n-icon class="ico-mdi-plus" />
        </template>
      </n-button>
    </template>

    <div>Add Icon Source</div>
  </n-tooltip>

  <n-modal v-model:show="show" closable>
    <n-card
      style="width: 600px"
      title="Add Icon Source"
      closable
      :segmented="{
        content: true,
        footer: 'soft',
      }"
      @close="show = false"
    >
      <n-form label-placement="left" require-mark-placement="right-hanging" label-width="auto">
        <n-form-item label="Name">
          <n-input v-model:value="newSource.name" placeholder="Enter a name for the icon set" />
        </n-form-item>

        <n-form-item label="URL">
          <n-input v-model:value="newSource.url" placeholder="Enter the URL of the icon set" type="text" class="font-mono" />
        </n-form-item>

        <n-form-item v-if="availableCollections.length > 0" label="Collections">
          <n-scrollbar class=" max-h-40vh overflow-y-auto w-full" trigger="none">
            <div class="flex flex-col gap-2">
              <n-checkbox
                v-for="collection in availableCollections"
                :key="collection.id"
                :checked="newSource.collections.some((selectedCollection) => selectedCollection.id === collection.id)"
                @update:checked="(checked) => {
                  if (checked) {
                    newSource.collections.push(collection)
                  }
                  else {
                    newSource.collections = newSource.collections.filter((selectedCollection) => selectedCollection.id !== collection.id)
                  }
                }"
              >
                {{ collection.name }}
              </n-checkbox>
            </div>
          </n-scrollbar>
        </n-form-item>
      </n-form>

      <template #action>
        <div class="flex justify-between">
          <n-button type="default" @click="show = false">
            Cancel
          </n-button>
          <n-button :disabled="!validSource" type="primary" @click="addSource">
            Add
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
