<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === "dark")

const stateTransitionDiagram = ref<HTMLElement | null>(null)
const isMathRendered = ref<boolean>(false)
const isMathematicalProofEnabled = ref<boolean>(false)

const comparisonSinners = useComparisonSinners()
const sinnerClashSkill = useCustomSinnerClashSkill()
const enemyClashSkill = useCustomEnemyClashSkill()

const clashResult = computed(() => {
  console.time("Computed clash")
  const result = computeClash(sinnerClashSkill.value, enemyClashSkill.value)
  console.timeEnd("Computed clash")
  return result
})

let renderMath = () => {
  nextTick(() => {
    drawStateTransitionGraph(
      clashResult.value,
      stateTransitionDiagram.value,
      isDarkMode.value
    )
    if (isMathematicalProofEnabled && document)
      typesetMathJax(
        <HTMLElement[]>(
          Array.from(document.getElementsByClassName("has-mathjax"))
        )
      ).then(() => (isMathRendered.value = true))
  })
}

onMounted(() => {
  renderMath()
  renderMath = debounce(renderMath, 500)
})
watch([clashResult, colorMode, isMathematicalProofEnabled], () => {
  isMathRendered.value = false
  renderMath()
})

useHead({
  title: "Clash Calculator",
  script: [
    {
      type: "text/javascript",
      id: "MathJax-script",
      async: true,
      src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
    },
    {
      type: "application/ld+json",
      children: `{
        "@context" : "https://schema.org",
        "@type" : "WebSite",
        "name" : "LimbusCompute",
        "url" : "${runtimeConfig.public.fullBaseUrl}"
      }`,
    },
  ],
})
</script>

<template>
  <div>
    <div class="pb-2 flex flex-wrap items-center gap-2">
      <img class="w-10 h-10" src="/img/logo.svg" />
      <span class="font-bold text-3xl text-red-800 dark:text-yellow-400">
        LimbusCompute
      </span>
      <span class="font-bold text-2xl"> Clash Calculator (WIP) </span>
    </div>
    <div class="flex gap-4 flex-wrap">
      <SinnerSkillForm
        class="p-2 h-fit rounded-lg bg-yellow-300 dark:bg-yellow-700 flex-grow"
      />
      <EnemySkillForm
        class="p-2 h-fit rounded-lg bg-red-300 dark:bg-red-700 flex-grow"
      />
      <div
        class="flex h-fit flex-col p-2 bg-blue-200 dark:bg-blue-800 rounded-lg gap-1 flex-grow md:w-96"
      >
        <h1 class="font-bold text-lg text-center">Comparisons</h1>
        <UDivider class="my-2" />
        <div v-if="comparisonSinners.length" class="flex flex-col gap-2">
          <SinnerClashSummary
            :identity-or-ego-id="sinner.identityOrEgoId"
            v-for="sinner in comparisonSinners"
            :key="sinner.identityOrEgoId"
            class="p-2 rounded-lg bg-blue-300 dark:bg-blue-700"
          />
        </div>
        <div v-else>
          Click on "Add Identity" to compare all skills of multiple
          sinners/identities at once!
        </div>
      </div>
    </div>
    <UDivider class="my-2" />
    <div class="text-xl">
      Clash win rate:
      <span class="font-bold">
        {{ (clashResult.winRate * 100).toFixed(1) }}%
      </span>
      <ClashWinRateText
        class="inline-block font-bold"
        :win-rate="clashResult.winRate"
      />
    </div>
    <UDivider class="my-2" />
    <div class="text-sm text-gray-600 dark:text-gray-400">
      Note:
      <ul class="list-disc">
        <li class="ml-4">
          The in-game win rate is deceiving as it is a naive calculation that
          does not account for clashes after losing a coin (which you may still
          win) and is entirely inaccurate when negative Coin Power skills are
          involved.
        </li>
        <li class="ml-4">
          Some skills, passives and support passives may conditionally grant
          extra Coin Power and Clash Power that is not accounted for by default
          in this calculator. You may edit the values manually.
        </li>
        <li class="ml-4">
          Some skills, passives and support passives may grant extra Coin Power
          and Clash Power based on the in-game win rate and NOT the accurate win
          rate calculation given here. See the passive of Ishmael's base Zayin
          E.G.O "Snagharpoon". You may edit the values manually.
        </li>
        <li class="ml-4">A better win rate does not guarantee a clash win.</li>
      </ul>
    </div>
    <UDivider class="my-2" />
    <div>
      <p>
        Each node represents a scenario of the number of remaining coins of the
        (sinner, enemy). The value along each arrow represents the probability
        of reaching a specific scenario in a clash.
      </p>
      <p>
        When a character has a lower clash power than its opponent, the
        character will lose a coin. For example, if a sinner gets a lower clash
        power than the enemy, the sinner will lose a coin, and a (2, 3) scenario
        will change into a (1, 3) scenario.
      </p>
      <div class="overflow-x-auto">
        <div class="mx-auto w-fit" ref="stateTransitionDiagram"></div>
      </div>
      <p>
        Note: The graph may be disconnected if some values are too close to zero
        due to insufficient precision.
      </p>
      <div>
        <UButton
          v-if="isMathematicalProofEnabled"
          class="font-bold my-2"
          icon="i-heroicons-eye-slash"
          color="red"
          variant="soft"
          @click="isMathematicalProofEnabled = false"
        >
          Hide Mathematical Proof
        </UButton>
        <UButton
          v-else
          class="font-bold my-2"
          icon="i-heroicons-eye"
          variant="soft"
          @click="isMathematicalProofEnabled = true"
        >
          Show Mathematical Proof (WIP)
        </UButton>
      </div>
      <div v-if="isMathematicalProofEnabled" class="overflow-x-auto">
        <div v-if="!isMathRendered" class="flex flex-col gap-2 w-full">
          <USkeleton class="h-4" />
          <USkeleton class="h-4" />
          <USkeleton class="h-96 w-96 mx-auto" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
          <USkeleton class="h-96" />
        </div>
        <ClientOnly>
          <p
            class="has-mathjax"
            :class="{ visible: isMathRendered, invisible: !isMathRendered }"
          >
            This game can be illustrated as an absorbing Markov chain, \(P\).
            The initial state is when both players still have all of their coins
            as in round one. State transitions differ depending on who loses a
            coin. Each state transition has a different probability. The
            absorbing states are when a player has lost all of their coins.
          </p>
          <p
            class="has-mathjax"
            :class="{ visible: isMathRendered, invisible: !isMathRendered }"
          >
            {{
              `\\[
            \\begin{align}
            \\text{Let } &S &&= \\text{the character's sanity} \\\\
            &ClashPow_{self}(h) &&= \\text{the character's final clashing power given } h \\\\
            &h &&= \\text{the number of coins flipped heads} \\\\
            &BasePow_{self} &&= \\text{the skill's base power} \\\\
            &CoinPow_{self} &&= \\text{the skill's coin power on flipping heads} \\\\
            &OffLevel_{self} &&= \\text{the skill's offense level} \\\\
            &OffLevel_{opponent} &&= \\text{the opponent's skill's offense level} \\\\
            \\end{align}
          \\]`
            }}
          </p>
          <p
            class="has-mathjax"
            :class="{ visible: isMathRendered, invisible: !isMathRendered }"
          >
            {{
              `\\[
            \\begin{align}
            P(\\text{flipping heads}) &= 0.5 + \\frac{S}{100}
            \\\\
            ClashPow_{self}(h) &=
            BasePow_{self} + (h \\cdot CoinPow_{self}) +
            \\max
            \\left\\{0, \\left\\lfloor \\frac{ OffLevel_{self} -
            OffLevel_{opponent} }{3} \\right\\rfloor\\right\\}
            \\end{align}
          \\]`
            }}
          </p>
          <p
            class="has-mathjax"
            :class="{ visible: isMathRendered, invisible: !isMathRendered }"
          >
            {{
              `\\[
            \\begin{align}
            P &= ${getMatrixMarkup(
              clashResult.stochasticMatrix,
              isDarkMode
            )} \\\\
            Q &= ${getMatrixMarkup(clashResult.Qmatrix, isDarkMode)} \\\\
            R &= ${getMatrixMarkup(clashResult.Rmatrix, isDarkMode)} \\\\
            \\\\
            N &= (I - Q)^{-1} \\\\
            &= \\left( ${getMatrixMarkup(clashResult.Imatrix, isDarkMode)} -
            ${getMatrixMarkup(
              clashResult.Qmatrix,
              isDarkMode
            )} \\right)^{-1} \\\\
            &= ${getMatrixMarkup(
              clashResult.fundamentalMatrix,
              isDarkMode
            )} \\\\
            \\\\
            B &= NR \\\\
            &= ${getMatrixMarkup(clashResult.fundamentalMatrix, isDarkMode)}
            ${getMatrixMarkup(clashResult.Rmatrix, isDarkMode)} \\\\ &=
            ${getMatrixMarkup(clashResult.Bmatrix, isDarkMode, true)}
            \\end{align}
          \\]`
            }}
          </p>
        </ClientOnly>
      </div>
      <div
        v-if="isMathematicalProofEnabled"
        class="flex flex-col gap-2 font-bold my-2"
      >
        <div class="flex items-center">
          <img src="/img/ryoshu.png" class="w-28 h-28 block rounded-lg" />
          <div class="speech-left p-2 ml-4 rounded-lg relative">Q.E.D.</div>
        </div>
        <div class="flex items-center">
          <img src="/img/sinclair.png" class="w-28 h-28 block rounded-lg" />
          <div class="speech-left p-2 ml-4 rounded-lg relative">
            Quantitative Education Delivered.
          </div>
        </div>
      </div>
      <div>
        <UButton
          v-if="isMathematicalProofEnabled"
          class="font-bold my-2"
          icon="i-heroicons-eye-slash"
          color="red"
          variant="soft"
          @click="isMathematicalProofEnabled = false"
        >
          Hide Mathematical Proof
        </UButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.speech-left {
  color: #fccf1c;
  background: #8e0000;
}

.speech-left::after {
  display: block;
  width: 0;
  content: "";
  border: 6px solid transparent;
  position: absolute;
  border-right-color: #8e0000;
  border-left: 0;
  left: -6px;
  top: calc(50% - 6px);
}
</style>
