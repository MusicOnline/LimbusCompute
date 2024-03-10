<template>
  <footer class="text-gray-600 dark:text-gray-300">
    <div class="flex flex-wrap items-center gap-2">
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1 font-bold md:text-xl">
          <img class="w-6 h-6" src="/img/logo.svg" />
          <span class="text-red-800 dark:text-yellow-400">
            LimbusCompute: Limbus Company Toolbox
          </span>
        </div>
        <div>
          <ul class="flex gap-2 text-sm underline md:gap-4 md:text-base">
            <li>
              <UButton
                class="p-0"
                color="black"
                variant="link"
                to="https://github.com/MusicOnline/LimbusCompute#special-thanks"
                target="_blank"
              >
                Credits
              </UButton>
            </li>
          </ul>
          <GitStatus class="text-xs" />
        </div>
      </div>
      <div class="ml-auto flex flex-col items-end gap-1 text-sm md:gap-2">
        <div class="flex items-center gap-1">
          <span> Made with </span>
          <a class="flex items-center" href="https://nuxt.com" target="_blank">
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-nuxt-icon"
            />
          </a>
          <a class="flex items-center" href="https://vuejs.org" target="_blank">
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-vue"
            />
          </a>
          <a
            class="flex items-center"
            href="https://tailwindcss.com"
            target="_blank"
          >
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-logos-tailwindcss-icon"
            />
          </a>
          <UIcon
            class="bg-contain bg-center text-xl md:text-2xl"
            name="i-emojione-red-heart"
          />
        </div>
        <div>
          <a
            class="flex items-center gap-1"
            href="https://github.com/MusicOnline/LimbusCompute"
            target="_blank"
          >
            <span> Watch development on </span>
            <UIcon
              class="bg-contain bg-center text-xl md:text-2xl"
              name="i-mdi-github"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
