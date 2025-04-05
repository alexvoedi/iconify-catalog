<script setup lang="ts">
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
  url: '',
})

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
</script>

<template>
  <n-button secondary size="large" @click="show = true">
    <template #icon>
      <n-icon class="ico-mdi-plus" />
    </template>

    <span>Add Icon Source</span>
  </n-button>

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
