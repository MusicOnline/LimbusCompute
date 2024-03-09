// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      meta: [
        { name: "apple-mobile-web-app-title", content: "LimbusCompute" },
        { name: "application-name", content: "LimbusCompute" },
        { name: "msapplication-TileColor", content: "#8e0000" },
        { name: "theme-color", content: "#8e0000" },
      ],
      link: [
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon-32x32.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon-16x16.png",
        },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#8e0000" },
      ],
    },
  },
  ssr: process.env.ENABLE_SSR?.toLowerCase() === "true",
  modules: ["@nuxt/ui"],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      fullBaseUrl: process.env.NUXT_PUBLIC_FULL_BASE_URL,
    },
  },
})
