<script setup lang="ts">
const colorMode = useColorMode()
const isDarkMode = computed(() => colorMode.value === "dark")

const stateTransitionDiagram = ref<HTMLElement | null>(null)
const isMathRendered = ref<boolean>(false)
const isMathematicalProofEnabled = ref<boolean>(false)

const customSinnerStats = useCustomSinnerStats()
const customSinnerSkill = useCustomSinnerSkill()
const customEnemySkill = useCustomEnemySkill()
const comparisonSinners = useComparisonSinners()

const clashResult = computed(() => {
  const p1 = new ClashSkill(
    customSinnerSkill.value.basePower,
    customSinnerSkill.value.numCoins,
    customSinnerSkill.value.coinPower,
    customSinnerStats.value.sanity,
    customSinnerSkill.value.offenseLevel,
    customSinnerSkill.value.finalClashPowerModifier,
    customSinnerStats.value.paralyzeCount
  )
  const p2 = new ClashSkill(
    customEnemySkill.value.basePower,
    customEnemySkill.value.numCoins,
    customEnemySkill.value.coinPower,
    customEnemySkill.value.sanity,
    customEnemySkill.value.offenseLevel,
    customEnemySkill.value.finalClashPowerModifier,
    customEnemySkill.value.paralyzeCount
  )

  console.time("Computed clash")
  const result = computeClash(p1, p2)
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
        class="p-2 rounded-lg bg-yellow-300 dark:bg-yellow-700 flex-grow"
      />
      <EnemySkillForm
        class="p-2 rounded-lg bg-red-300 dark:bg-red-700 flex-grow"
      />
      <div
        class="flex flex-col p-2 bg-blue-200 dark:bg-blue-800 rounded-lg gap-1 flex-grow md:w-96"
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
        <div ref="stateTransitionDiagram"></div>
      </div>
      <p>
        Note: The graph may be disconnected if some values are too close to zero
        due to insufficient precision.
      </p>
      <div>
        <input
          id="showMathematicalProofCheckbox"
          type="checkbox"
          v-model="isMathematicalProofEnabled"
        />
        <label for="showMathematicalProofCheckbox">
          Show Mathematical Proof (WIP)
        </label>
      </div>
      <ClientOnly>
        <div v-if="isMathematicalProofEnabled" class="overflow-x-auto">
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
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
