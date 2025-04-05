<script setup lang="ts">
import type { Collections } from '@/types/Collections'
import ky from 'ky'

const emit = defineEmits<{
  addSource: [{
    name: string
    url: string
  }]
}>()

const show = ref(false)

const validSource = ref(false)

const newSource = ref({
  name: '',
  url: 'https://',
})

const availableCollections = ref<Collections>({})

watchDebounced(
  () => newSource.value,
  async (newValue) => {
    try {
      const url = new URL('/collections', newValue.url)

      const response = await ky.get(url)

      if (!response.ok) {
        throw new Error('Invalid URL')
      }

      validSource.value = true

      await fetchAvailableCollections()
    }
    catch {
      validSource.value = false
    }
  },
  { debounce: 1_000, deep: true },
)

function addSource() {
  if (validSource.value) {
    emit('addSource', newSource.value)
    show.value = false
  }
}

async function fetchAvailableCollections() {
  if (!newSource.value.url) {
    return
  }

  try {
    const url = new URL('/collections', newSource.value.url)
    const response = await ky.get(url).json<Collections>()

    availableCollections.value = response
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

        <n-form-item v-if="Object.keys(availableCollections).length > 0" label="Collections">
          <n-scrollbar class=" max-h-40vh overflow-y-auto w-full" trigger="none">
            <div class="flex flex-col gap-2">
              <n-checkbox v-for="([prefix, data]) in Object.entries(availableCollections)" :key="prefix">
                {{ data.name }}
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
