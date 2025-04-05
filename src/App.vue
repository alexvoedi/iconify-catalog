<script setup lang="ts">
import { darkTheme } from 'naive-ui'
</script>

<template>
  <n-config-provider :theme="darkTheme">
    <n-message-provider placement="bottom">
      <router-view class="container mx-auto" />
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html {
  background-color: rgb(16, 16, 20);
  overflow-y: scroll;
}
</style>
