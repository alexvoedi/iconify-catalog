<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useCollectionStore } from './store/collection'

const collectionStore = useCollectionStore()
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider placement="bottom">
      <n-layout class="h-screen overflow-hidden" content-class="overflow-hidden" has-sider>
        <TheNav />
        <n-layout-content>
          <n-scrollbar>
            <div class="container mx-auto p-8">
              <Collection v-if="collectionStore.selectedCollection" />
              <n-alert v-else show-icon type="info" title="Please select a collection" />
            </div>
          </n-scrollbar>
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html, body {
  background-color: rgb(16, 16, 20);
  height: 100dvh;
  overflow: hidden;
}
</style>
