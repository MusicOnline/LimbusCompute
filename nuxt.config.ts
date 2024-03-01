// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: process.env.ENABLE_SSR?.toLowerCase() === "true",
  devtools: { enabled: true },
})
