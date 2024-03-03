<script setup lang="ts">
import { instance as viz } from "@viz-js/viz"
import {
  SinnerIdentityJsonSchema,
  type SinnerIdentityJson,
  type SinnerIdentity,
} from "@/entities/SinnerIdentity"
import type { CoinNumberState } from "~/utils/entities"

const DATA_REPOSITORY_ROOT_URL =
  "https://raw.githubusercontent.com/SyxP/ObiterDicta.jl/main/data/"

const SINNER_IDENTITY_DATA_ROOT_URL = new URL(
  "StaticData/static-data/personality/",
  DATA_REPOSITORY_ROOT_URL
).toString()

const SINNER_SKILL_DATA_ROOT_URL = new URL(
  "StaticData/static-data/skill/",
  DATA_REPOSITORY_ROOT_URL
).toString()

const SINNER_IDENTITY_LOCALE_EN_FILENAME = "EN_Personalities.json"
const SKILL_LOCALE_EN_FILENAME = "EN_Skills.json"

const LOCALE_EN_ROOT_URL = new URL(
  "Localize/en/",
  DATA_REPOSITORY_ROOT_URL
).toString()

const SINNER_TO_NAME = {
  yisang: "Yi Sang",
  faust: "Faust",
  donquixote: "Don Quixote",
  ryoshu: "Ryōshū",
  mersault: "Mersault",
  honglu: "Hong Lu",
  heathcliff: "Heathcliff",
  ishmael: "Ishmael",
  rodion: "Rodion",
  sinclair: "Sinclair",
  outis: "Outis",
  gregor: "Gregor",
}

const SINNER_TO_NUMBER = {
  yisang: 1,
  faust: 2,
  donquixote: 3,
  ryoshu: 4,
  mersault: 5,
  honglu: 6,
  heathcliff: 7,
  ishmael: 8,
  rodion: 9,
  sinclair: 10,
  outis: 11,
  gregor: 12,
}

const sinnerToIdentityData = useState<{ [key: string]: SinnerIdentityJson }>(
  "sinnerToIdentityData",
  () => ({})
)
const sinnerToSkillData = useState<{ [key: string]: any }>(
  "sinnerToSkillData",
  () => ({})
)
const sinnerToSkillLocale = useState<{ [key: string]: any }>(
  "sinnerToSkillLocale",
  () => ({})
)
const isLoadingSinner = ref<boolean>(false)
const sinnerKey = ref<string | null>(null)
const sinnerIdentityId = ref<string | null>(null)
const sinnerSkillId = ref<string | null>(null)

const { data: sinnerIdentityLocaleEN } = await useFetch(
  new URL(SINNER_IDENTITY_LOCALE_EN_FILENAME, LOCALE_EN_ROOT_URL).toString(),
  {
    key: "sinnerIdentityLocaleEN",
    transform(response) {
      return JSON.parse(<string>response)
    },
  }
)

const { data: sinnerSkillLocaleEN } = await useFetch(
  new URL(SKILL_LOCALE_EN_FILENAME, LOCALE_EN_ROOT_URL).toString(),
  {
    key: "sinnerSkillLocaleEN",
    transform(response) {
      return JSON.parse(<string>response)
    },
  }
)

async function changeSinner() {
  sinnerIdentityId.value = null
  sinnerSkillId.value = null
  if (!sinnerKey.value) return
  const sinnerKeyCopy = sinnerKey.value
  if (!Object.hasOwn(sinnerToIdentityData.value, sinnerKeyCopy)) {
    isLoadingSinner.value = true
    const identityPromise = await $fetch(
      new URL(
        `personality-${SINNER_TO_NUMBER[sinnerKeyCopy]
          .toString()
          .padStart(2, "0")}.json`,
        SINNER_IDENTITY_DATA_ROOT_URL
      ).toString()
    ).then((response) => {
      const data = SinnerIdentityJsonSchema.parse(JSON.parse(<string>response))
      sinnerToIdentityData.value[sinnerKeyCopy] = data
      return data
    })
    const skillPromise = await $fetch(
      new URL(
        `personality-skill-${SINNER_TO_NUMBER[sinnerKeyCopy]
          .toString()
          .padStart(2, "0")}.json`,
        SINNER_SKILL_DATA_ROOT_URL
      ).toString()
    ).then((response) => {
      const data = JSON.parse(<string>response)
      sinnerToSkillData.value[sinnerKeyCopy] = data
      return data
    })
    const skillLocalePromise = await $fetch(
      new URL(
        `EN_Skills_personality-${SINNER_TO_NUMBER[sinnerKeyCopy]
          .toString()
          .padStart(2, "0")}.json`,
        LOCALE_EN_ROOT_URL
      ).toString()
    ).then((response) => {
      const data = JSON.parse(<string>response)
      sinnerToSkillLocale.value[sinnerKeyCopy] = data
      return data
    })
    return await Promise.all([
      identityPromise,
      skillPromise,
      skillLocalePromise,
    ]).then(() => (isLoadingSinner.value = false))
  }
}

const sinnerIdentity = computed<SinnerIdentity | null>(() => {
  if (!sinnerIdentityId.value) return
  return (
    sinnerToIdentityData.value[sinnerKey.value!]?.list.find(
      (entry) => entry.id === Number(sinnerIdentityId.value)
    ) ?? null
  )
})

const sinnerIdentitySkills = computed(() => {
  if (!sinnerIdentity.value) return []
  return sinnerIdentity.value.attributeList.map((entry) =>
    getSinnerSkill(sinnerKey.value!, entry.skillId)
  )
})

const sinnerSkill = computed(() => {
  if (!sinnerKey.value || !sinnerSkillId.value) return
  return getSinnerSkill(sinnerKey.value, sinnerSkillId.value)
})

function getSinnerSkill(sinnerKey: string, sinnerSkillId: string | number) {
  return (
    sinnerToSkillData.value[sinnerKey].list.find(
      (entry) => entry.id === sinnerSkillId
    ) ?? null
  )
}

function getIdentityName(identityId: string | number): string | null {
  return (
    sinnerIdentityLocaleEN.value.dataList
      .find((entry) => entry.id === Number(identityId))
      ?.title.replaceAll("\n", " ") ?? null
  )
}

function getSinnerSkillName(
  sinnerKey: string,
  sinnerSkillId: string | number
): string | null {
  const searchList = (file) =>
    file.dataList
      .find((entry) => entry.id === Number(sinnerSkillId))
      ?.levelList.slice(-1)[0].name ?? null
  const sharedFileSkill = searchList(sinnerSkillLocaleEN.value)
  if (sharedFileSkill) return sharedFileSkill
  return searchList(sinnerToSkillLocale.value[sinnerKey])
}

const p1Data = ref({
  basePower: 4,
  numCoins: 2,
  sanity: 4,
  coinPower: 11,
  offenseLevel: 40,
})

const p2Data = ref({
  basePower: 4,
  numCoins: 3,
  sanity: 20,
  coinPower: 3,
  offenseLevel: 40,
})

const clashResult = computed(() => {
  const p1 = new Clasher(
    p1Data.value.basePower,
    p1Data.value.numCoins,
    p1Data.value.sanity,
    p1Data.value.coinPower,
    p1Data.value.offenseLevel
  )
  const p2 = new Clasher(
    p2Data.value.basePower,
    p2Data.value.numCoins,
    p2Data.value.sanity,
    p2Data.value.coinPower,
    p2Data.value.offenseLevel
  )

  console.time("Computed clash")
  const result = computeClash(p1, p2)
  console.timeEnd("Computed clash")
  return result
})

const stateTransitionDiagram = ref<HTMLElement | null>(null)

function coinNumberStateToLabel({ p1, p2 }: CoinNumberState): string {
  if (p1 === 1 && p2 === 0) return "Win"
  if (p2 === 1 && p1 === 0) return "Lose"
  return `${p1},${p2}`
}

function modifyStochasticMatrixForPresentation(
  result: ClashResult
): number[][] {
  return result.stochasticMatrix.map((row, i) =>
    row.map((prob, j) => {
      const fromState = result.states[i]
      const toState = result.states[j]
      if (
        (fromState.p1 === 0 &&
          toState.p1 === 0 &&
          fromState.p2 - toState.p2 === 1) ||
        (fromState.p2 === 0 &&
          toState.p2 === 0 &&
          fromState.p1 - toState.p1 === 1) ||
        (toState.some((x) => x === 0) && toState.sum() > 1)
      )
        return 0
      if (toState.p1 === 0 && toState.p2 === 1 && fromState.p1 === 1) {
        const index = result.states.findIndex(
          (state) => state.p1 === 0 && state.p2 === fromState.p2
        )
        return result.stochasticMatrix[i][index]
      }
      if (toState.p2 === 0 && toState.p1 === 1 && fromState.p2 === 1) {
        const index = result.states.findIndex(
          (state) => state.p2 === 0 && state.p1 === fromState.p1
        )
        return result.stochasticMatrix[i][index]
      }
      return prob
    })
  )
}

function drawStateTransitionGraph() {
  const states = clashResult.value.states.map(coinNumberStateToLabel)

  const dotGraph = `
  digraph {
    rankdir=LR; // Left to right layout
    label = "State Transition Graph";

    // Define absorbing state nodes
    node [shape = doublecircle style = filled];
    Win Lose;

    // Define other nodes
    node [shape = circle];
    ${states
      .filter(
        (_, i) =>
          clashResult.value.states[i].every((x) => x > 0) ||
          clashResult.value.states[i].sum() === 1
      )
      .map((state) => `"${state}" [label="${state}"];`)
      .join("\n")}

    // Define edges
    ${modifyStochasticMatrixForPresentation(clashResult.value)
      .map((row, i) =>
        row
          .map((prob, j) => {
            if (prob > 0 && !["Win", "Lose"].includes(states[i])) {
              return `"${states[i]}" -> "${states[j]}" [label="${prob.toFixed(
                2
              )}"
                color="#000000${Math.round(255 * prob)
                  .toString(16)
                  .padStart(2, "0")}"
                fontcolor="#000000${Math.round(255 * prob)
                  .toString(16)
                  .padStart(2, "0")}"];`
            }
            return ""
          })
          .join("\n")
      )
      .join("\n")}
    Win [fillcolor="#00ff7f${Math.round(255 * clashResult.value.winRate)
      .toString(16)
      .padStart(2, "0")}"];
    Lose [fillcolor="#ff0000${Math.round(255 * (1 - clashResult.value.winRate))
      .toString(16)
      .padStart(2, "0")}"
      fontcolor=${clashResult.value.winRate > 0.3 ? "black" : "white"}];
  }
`

  // Render the graph using Viz.js
  viz().then((viz) => {
    stateTransitionDiagram.value?.replaceChildren()
    stateTransitionDiagram.value?.appendChild(viz.renderSVGElement(dotGraph))
  })
}

function typeset(elements: HTMLElement[] | null = null) {
  if (!window.MathJax) return
  window.MathJax.startup.promise = MathJax.startup.promise
    .then(() => MathJax.typesetPromise(elements))
    .catch((err) => console.log("Typeset failed: " + err.message))
  return MathJax.startup.promise
}

let renderMath = () => {
  nextTick(() => {
    drawStateTransitionGraph()
    typeset()
  })
}

onMounted(() => {
  renderMath()
  renderMath = debounce(renderMath, 500)
})
watch(
  () => clashResult.value,
  () => renderMath()
)

useHead({
  script: [
    {
      type: "text/javascript",
      id: "MathJax-script",
      // async: true,
      // src: "https://cdn.jsdelivr.net/npm/mathjax@4.0.0-beta.4/tex-mml-chtml.js",
      src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
    },
  ],
})

function getMatrixMarkup(matrix: number[][], isBmatrix: boolean = false) {
  let matrixHtml = "\\begin{bmatrix}"

  matrix.forEach((row, i) => {
    matrixHtml +=
      row
        .map((prob, j) => {
          const valueString = prob.toFixed(2)
          if (isBmatrix && i === 0 && j === 0)
            return `\\color{green}{${valueString}}`
          if (isBmatrix && i === 0 && j === 1)
            return `\\color{red}{${valueString}}`
          if (valueString === "0.00") return "\\color{lightgray}{0.00}"
          return valueString
        })
        .join(" & ") + "\\\\"
  })

  matrixHtml += "\\end{bmatrix}"
  return matrixHtml
}
</script>

<template>
  <div>
    <h1>[Limbus Compute] Clash Calculator (WIP)</h1>
    <form>
      <div>
        <div>
          <label for="p1Sinner">Select Sinner:</label>
          <select id="p1Sinner" v-model="sinnerKey" @change="changeSinner()">
            <option disabled value="">Select one</option>
            <option
              v-for="(name, key) in SINNER_TO_NAME"
              :value="key"
              :key="key"
            >
              {{ name }}
            </option>
          </select>
        </div>
        <div>
          <label for="p1SinnerIdentity">Select Identity:</label>
          <ClientOnly>
            <select
              id="p1SinnerIdentity"
              v-model="sinnerIdentityId"
              :disabled="!sinnerKey || !sinnerToIdentityData[sinnerKey]"
              @change="sinnerSkillId = null"
            >
              <option disabled value="">Select one</option>
              <template v-if="!isLoadingSinner">
                <option
                  v-for="identity in sinnerToIdentityData[sinnerKey!]?.list || []"
                  :value="identity.id"
                  :key="identity.id"
                >
                  {{ getIdentityName(identity.id) }}
                </option>
              </template>
            </select>
          </ClientOnly>
        </div>
        <div>
          <label for="p1SinnerSkill">Select Skill (WIP):</label>
          <ClientOnly>
            <select
              id="p1SinnerSkill"
              v-model="sinnerSkillId"
              :disabled="
                !sinnerKey ||
                !sinnerToIdentityData[sinnerKey] ||
                !sinnerToSkillData[sinnerKey]
              "
            >
              <option disabled value="">Select one</option>
              <template v-if="!isLoadingSinner">
                <option
                  v-for="skill in sinnerIdentitySkills"
                  :value="skill.id"
                  :key="skill.id"
                >
                  {{ getSinnerSkillName(sinnerKey!, skill.id) }}
                </option>
              </template>
            </select>
          </ClientOnly>
        </div>
        <div>
          <label for="p1BasePower">Sinner Base Power:</label>
          <input
            type="number"
            id="p1BasePower"
            v-model.number="p1Data.basePower"
          />
        </div>
        <div>
          <label for="p1NumCoins">Sinner Number of Coins:</label>
          <input
            type="number"
            id="p1NumCoins"
            v-model.number="p1Data.numCoins"
          />
        </div>
        <div>
          <label for="p1CoinPower">Sinner Coin Power:</label>
          <input
            type="number"
            id="p1CoinPower"
            v-model.number="p1Data.coinPower"
          />
        </div>
        <div>
          <label for="p1Sanity">Sinner Sanity:</label>
          <input type="number" id="p1Sanity" v-model.number="p1Data.sanity" />
        </div>
        <div>
          <label for="p1OffenseLevel">Sinner Offense Level:</label>
          <input
            type="number"
            id="p1OffenseLevel"
            v-model.number="p1Data.offenseLevel"
          />
        </div>
      </div>
      <hr />
      <div>
        <div>
          <label for="p2BasePower">Enemy Base Power:</label>
          <input
            type="number"
            id="p2BasePower"
            v-model.number="p2Data.basePower"
          />
        </div>
        <div>
          <label for="p2NumCoins">Enemy Number of Coins:</label>
          <input
            type="number"
            id="p2NumCoins"
            v-model.number="p2Data.numCoins"
          />
        </div>
        <div>
          <label for="p2CoinPower">Enemy Coin Power:</label>
          <input
            type="number"
            id="p2CoinPower"
            v-model.number="p2Data.coinPower"
          />
        </div>
        <div>
          <label for="p2Sanity">Enemy Sanity:</label>
          <input type="number" id="p2Sanity" v-model.number="p2Data.sanity" />
        </div>
        <div>
          <label for="p2OffenseLevel">Enemy Offense Level:</label>
          <input
            type="number"
            id="p2OffenseLevel"
            v-model.number="p2Data.offenseLevel"
          />
        </div>
      </div>
    </form>
    <hr />
    <div style="font-size: x-large">
      Clash win rate:
      <span style="font-weight: bold">
        {{ (clashResult.winRate * 100).toFixed(1) }}%
      </span>
      <span
        v-if="clashResult.winRate > 0.9"
        style="font-weight: bold; color: green"
      >
        (Dominating)
      </span>
      <span
        v-else-if="clashResult.winRate > 0.6"
        style="font-weight: bold; color: darkgreen"
      >
        (Favored)
      </span>
      <span v-else-if="clashResult.winRate > 0.4" style="font-weight: bold">
        (Neutral)
      </span>
      <span
        v-else-if="clashResult.winRate > 0.1"
        style="font-weight: bold; color: darkred"
      >
        (Struggling)
      </span>
      <span v-else style="font-weight: bold; color: red"> (Hopeless) </span>
    </div>
    <hr />
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
      <div ref="stateTransitionDiagram"></div>
      <p>
        Note: The graph may be disconnected if some values are too close to zero
        due to insufficient precision.
      </p>
      <ClientOnly>
        <p class="has-mathjax">
          This game can be illustrated as an absorbing Markov chain, \(P\). The
          initial state is when both players still have all of their coins as in
          round one. State transitions differ depending on who loses a coin.
          Each state transition has a different probability. The absorbing
          states are when a player has lost all of their coins.
        </p>
        <p class="has-mathjax">
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
        <p class="has-mathjax">
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
        <p class="has-mathjax">
          {{
            `\\[
            \\begin{align}
            P &= ${getMatrixMarkup(clashResult.stochasticMatrix)} \\\\
            Q &= ${getMatrixMarkup(clashResult.Qmatrix)} \\\\
            R &= ${getMatrixMarkup(clashResult.Rmatrix)} \\\\
            \\\\
            N &= (I - Q)^{-1} \\\\
            &= \\left( ${getMatrixMarkup(clashResult.Imatrix)} -
            ${getMatrixMarkup(clashResult.Qmatrix)} \\right)^{-1} \\\\
            &= ${getMatrixMarkup(clashResult.fundamentalMatrix)} \\\\
            \\\\
            B &= NR \\\\
            &= ${getMatrixMarkup(clashResult.fundamentalMatrix)}
            ${getMatrixMarkup(clashResult.Rmatrix)} \\\\ &=
            ${getMatrixMarkup(clashResult.Bmatrix, true)}
            \\end{align}
          \\]`
          }}
        </p>
      </ClientOnly>
    </div>
  </div>
</template>
