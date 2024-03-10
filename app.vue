<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const route = useRoute()

useSeoMeta({
  ogSiteName: "LimbusCompute",
  ogTitle: "LimbusCompute: Limbus Company Toolbox",
  description:
    "Work-in-progress toolbox for Limbus Company, a turn-based RPG developed by Project Moon. Made with Nuxt.",
  ogDescription:
    "Work-in-progress toolbox for Limbus Company, a turn-based RPG developed by Project Moon. Made with Nuxt.",
  ogUrl: () => runtimeConfig.public.fullBaseUrl + route.path,
  ogLocale: "en",
  ogType: "website",
  twitterCard: "summary",
})

useHead({
  title: null,
  titleTemplate(title) {
    return title ? `${title} | LimbusCompute` : "LimbusCompute"
  },
  meta: [
    {
      key: "og:image",
      property: "og:image",
      content: "/favicon-32x32.png",
    },
    {
      key: "og:image:type",
      property: "og:image:type",
      content: "image/png",
    },
    {
      key: "og:image:width",
      property: "og:image:width",
      content: "32",
    },
    {
      key: "og:image:height",
      property: "og:image:height",
      content: "32",
    },
  ],
})
</script>

<template>
  <div>
    <Body class="bg-gray-100 dark:bg-gray-900" />
    <div class="flex flex-col justify-between">
      <div class="p-2">
        <NuxtPage class="mx-auto max-w-7xl" />
      </div>
      <div class="relative w-full pt-4">
        <UDivider class="mx-auto max-w-7xl" />
        <Footer class="mx-auto w-full max-w-7xl px-2 py-4 md:py-8" />
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
