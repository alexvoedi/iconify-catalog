<script setup lang="ts">
import { getFullIconName } from '@/utils/getFullIconName'
import { Icon } from '@iconify/vue'
import { useMessage } from 'naive-ui'

const props = defineProps<{
  provider: string
  prefix: string
  name: string
}>()

const message = useMessage()

const fullIconName = getFullIconName(props.prefix, props.name)

function copyToClipboard(prefix: string, name: string) {
  navigator.clipboard.writeText(`${prefix}:${name}`)
    .then(() => {
      message.success(`
        Copied ${prefix}:${name} to clipboard
      `)
    })
    .catch(() => {
      message.error('Failed to copy')
    })
}
</script>

<template>
  <n-tooltip :delay="200">
    <template #trigger>
      <button
        class="w-full rounded p-3 bg-true-gray-800"
        @click="copyToClipboard(prefix, name)"
      >
        <div class="gap-4 overflow-hidden flex flex-col items-center justify-center">
          <Icon :icon="`@${provider}:${prefix}:${name}`" :height="28" />

          <div class="text-true-gray-400 text-left font-mono text-ellipsis whitespace-nowrap">
            {{ name }}
          </div>
        </div>
      </button>
    </template>

    <pre>{{ fullIconName }}</pre>
  </n-tooltip>
</template>
