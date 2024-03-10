import { execSync } from "child_process"

function runTerminal(command: string): string {
  return execSync(command).toString().trim()
}

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
  ui: {
    icons: ["heroicons", "mdi", "logos", "emojione"],
  },
  runtimeConfig: {
    public: {
      fullBaseUrl: process.env.NUXT_PUBLIC_FULL_BASE_URL,
      commit: {
        id:
          process.env.NUXT_PUBLIC_COMMIT_ID ||
          runTerminal("git log --format=%h -n 1"),
        message:
          process.env.NUXT_PUBLIC_COMMIT_MESSAGE ||
          runTerminal("git log --format=%s -n 1"),
        timestamp:
          process.env.NUXT_PUBLIC_COMMIT_TIMESTAMP ||
          runTerminal("git log --format=%ct -n 1"),
        baseUrl: process.env.NUXT_PUBLIC_COMMIT_BASE_URL,
      },
    },
  },
})
