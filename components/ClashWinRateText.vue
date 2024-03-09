<script setup lang="ts">
defineProps<{
  winRate: number
}>()
</script>

<template>
  <div>
    <span v-if="winRate > 0.9" class="text-green-500"> (Dominating) </span>
    <span v-else-if="winRate > 0.6" class="text-green-700"> (Favored) </span>
    <span v-else-if="winRate > 0.4"> (Neutral) </span>
    <span v-else-if="winRate > 0.1" class="text-red-700"> (Struggling) </span>
    <span v-else class="text-red-500"> (Hopeless) </span>
  </div>
</template>
