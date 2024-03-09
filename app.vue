<script setup lang="ts">
useHead({
  title: null,
  titleTemplate(title) {
    return title ? `${title} | LimbusCompute` : "LimbusCompute"
  },
})
</script>

<template>
  <div>
    <Body class="bg-gray-100 dark:bg-gray-900" />
    <div class="flex flex-col justify-between">
      <div class="p-2">
        <NuxtPage class="mx-auto max-w-7xl" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  scroll-behavior: smooth;
  font-size: 14px;
}

svg {
  user-select: none;
}
</style>
