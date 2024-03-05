<script setup lang="ts">
import {
  SinnerIdentityJsonSchema,
  type SinnerIdentity,
} from "@/entities/SinnerIdentity"

const sinnerToIdentityData = useSinnerToIdentityData()
const sinnerToSkillData = useSinnerToSkillData()
const sinnerToSkillLocale = useSinnerToSkillLocale()

const isLoadingSinner = ref<boolean>(false)
const selectedSinnerKey = ref<keyof typeof SINNER_TO_NUMBER | null>(null)
const selectedSinnerIdentityId = ref<string | null>(null)
const selectedSinnerSkillId = ref<string | null>(null)

const stateTransitionDiagram = ref<HTMLElement | null>(null)
const isMathematicalProofVisible = ref<boolean>(false)

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
  selectedSinnerIdentityId.value = null
  selectedSinnerSkillId.value = null
  if (!selectedSinnerKey.value) return
  const sinnerKeyCopy = selectedSinnerKey.value
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
  if (!selectedSinnerIdentityId.value) return null
  return (
    sinnerToIdentityData.value[selectedSinnerKey.value!]?.list.find(
      (entry) => entry.id === Number(selectedSinnerIdentityId.value)
    ) ?? null
  )
})

const sinnerIdentitySkills = computed(() => {
  if (!sinnerIdentity.value) return []
  return sinnerIdentity.value.attributeList.map((entry) =>
    getSinnerSkill(selectedSinnerKey.value!, entry.skillId)
  )
})

const sinnerSkill = computed(() => {
  if (!selectedSinnerKey.value || !selectedSinnerSkillId.value) return
  const skill = getSinnerSkill(
    selectedSinnerKey.value,
    selectedSinnerSkillId.value
  )
  const skillUpgradeOverrides = [...skill.skillData].sort(
    (a, b) => b.gaksungLevel - a.gaksungLevel
  )
  let mergedSkill = {}
  skillUpgradeOverrides.forEach((override) => {
    if (override.gaksungLevel <= sinnerStats.value.uptie)
      mergedSkill = { ...mergedSkill, ...override }
  })
  return mergedSkill
})

function updateSinnerStats() {
  if (!sinnerSkill.value) return
  sinnerStats.value.basePower = sinnerSkill.value.defaultValue
  sinnerStats.value.numCoins = sinnerSkill.value.coinList.length
  sinnerStats.value.coinPower =
    (sinnerSkill.value.coinList[0].operatorType === "ADD" ? 1 : -1) *
    sinnerSkill.value.coinList[0].scale
  sinnerStats.value.offenseLevel =
    sinnerStats.value.level + sinnerSkill.value.skillLevelCorrection
}

function updateP1Data() {
  p1Data.value.basePower = sinnerStats.value.basePower
  p1Data.value.numCoins = sinnerStats.value.numCoins
  p1Data.value.coinPower = sinnerStats.value.coinPower
  p1Data.value.offenseLevel = sinnerStats.value.offenseLevel
}

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

const sinnerStats = ref({
  uptie: 4,
  level: 40,
  basePower: 0,
  numCoins: 0,
  coinPower: 0,
  offenseLevel: 0,
})

const p1Data = ref({
  basePower: 4,
  numCoins: 2,
  sanity: 4,
  coinPower: 11,
  offenseLevel: 40,
  finalClashPowerModifier: 0,
  paralyzeCount: 0,
})

const p2Data = ref({
  basePower: 4,
  numCoins: 3,
  sanity: 20,
  coinPower: 3,
  offenseLevel: 40,
  finalClashPowerModifier: 0,
  paralyzeCount: 0,
})

const clashResult = computed(() => {
  const p1 = new Clasher(
    p1Data.value.basePower,
    p1Data.value.numCoins,
    p1Data.value.sanity,
    p1Data.value.coinPower,
    p1Data.value.offenseLevel,
    p1Data.value.finalClashPowerModifier,
    p1Data.value.paralyzeCount
  )
  const p2 = new Clasher(
    p2Data.value.basePower,
    p2Data.value.numCoins,
    p2Data.value.sanity,
    p2Data.value.coinPower,
    p2Data.value.offenseLevel,
    p2Data.value.finalClashPowerModifier,
    p2Data.value.paralyzeCount
  )

  console.time("Computed clash")
  const result = computeClash(p1, p2)
  console.timeEnd("Computed clash")
  return result
})

let renderMath = () => {
  nextTick(() => {
    drawStateTransitionGraph(clashResult.value, stateTransitionDiagram.value)
    if (isMathematicalProofVisible) typesetMathJax()
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
      async: true,
      src: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js",
    },
  ],
})
</script>

<template>
  <div>
    <h1>[Limbus Compute] Clash Calculator (WIP)</h1>
    <form>
      <div>
        <div>
          <label for="sinnerStatsUptie">Sinner Uptie Tier:</label>
          <input
            type="number"
            id="sinnerStatsUptie"
            v-model.number="sinnerStats.uptie"
            min="1"
            max="4"
            @change="
              () => {
                updateSinnerStats()
                updateP1Data()
              }
            "
          />
        </div>
        <div>
          <label for="sinnerStatsLevel">Sinner Level:</label>
          <input
            type="number"
            id="sinnerStatsLevel"
            v-model.number="sinnerStats.level"
            min="1"
            max="40"
            @change="
              () => {
                updateSinnerStats()
                updateP1Data()
              }
            "
          />
        </div>
        <div>
          <label for="p1Sinner">Select Sinner:</label>
          <select
            id="p1Sinner"
            v-model="selectedSinnerKey"
            @change="changeSinner()"
          >
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
              v-model="selectedSinnerIdentityId"
              :disabled="
                !selectedSinnerKey || !sinnerToIdentityData[selectedSinnerKey]
              "
              @change="sinnerSkillId = null"
            >
              <option disabled value="">Select one</option>
              <template v-if="!isLoadingSinner">
                <option
                  v-for="identity in sinnerToIdentityData[selectedSinnerKey!]?.list || []"
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
          <label for="p1SinnerSkill">Select Skill:</label>
          <ClientOnly>
            <select
              id="p1SinnerSkill"
              v-model="selectedSinnerSkillId"
              :disabled="
                !selectedSinnerKey ||
                !sinnerToIdentityData[selectedSinnerKey] ||
                !sinnerToSkillData[selectedSinnerKey]
              "
              @change="
                () => {
                  updateSinnerStats()
                  updateP1Data()
                }
              "
            >
              <option disabled value="">Select one</option>
              <template v-if="!isLoadingSinner">
                <option
                  v-for="skill in sinnerIdentitySkills"
                  :value="skill.id"
                  :key="skill.id"
                >
                  {{ getSinnerSkillName(selectedSinnerKey!, skill.id) }}
                </option>
              </template>
            </select>
          </ClientOnly>
        </div>
        <hr />
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
        <div>
          <label for="p1FinalClashPowerModifier"
            >Sinner Final Clash Power Modifier:</label
          >
          <input
            type="number"
            id="p1FinalClashPowerModifier"
            v-model.number="p1Data.finalClashPowerModifier"
          />
        </div>
        <div>
          <label for="p1ParalyzeCount">Sinner Paralyze Count:</label>
          <input
            type="number"
            id="p1ParalyzeCount"
            v-model.number="p1Data.paralyzeCount"
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
        <div>
          <label for="p2FinalClashPowerModifier"
            >Enemy Final Clash Power Modifier:</label
          >
          <input
            type="number"
            id="p2FinalClashPowerModifier"
            v-model.number="p2Data.finalClashPowerModifier"
          />
        </div>
        <div>
          <label for="p2ParalyzeCount">Enemy Paralyze Count:</label>
          <input
            type="number"
            id="p2ParalyzeCount"
            v-model.number="p2Data.paralyzeCount"
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
      <div>
        <input
          id="showMathematicalProofCheckbox"
          type="checkbox"
          v-model="isMathematicalProofVisible"
          @change="
            () => {
              if (isMathematicalProofVisible) renderMath()
            }
          "
        />
        <label for="showMathematicalProofCheckbox">
          Show Mathematical Proof (WIP)
        </label>
      </div>
      <ClientOnly>
        <div v-if="isMathematicalProofVisible">
          <p class="has-mathjax">
            This game can be illustrated as an absorbing Markov chain, \(P\).
            The initial state is when both players still have all of their coins
            as in round one. State transitions differ depending on who loses a
            coin. Each state transition has a different probability. The
            absorbing states are when a player has lost all of their coins.
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
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
