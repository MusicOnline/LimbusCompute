<script setup lang="ts">
import { ClashSkill } from "~/utils/entities"

const { identityOrEgoId } = defineProps<{
  identityOrEgoId: number
}>()

const getComparisonSinner = useGetComparisonSinner()

const sinner = computed<ComparisonSinner>(
  () => <ComparisonSinner>getComparisonSinner(identityOrEgoId)
)

if (!sinner.value)
  throw new Error(`Comparison sinner ${identityOrEgoId} does not exist`)

const enemyClashSkill = useCustomEnemyClashSkill()

const getSinnerIdentityName = useGetSinnerIdentityName()
const getSinnerSkillName = useGetSinnerSkillName()
const removeComparisonSinner = useRemoveComparisonSinner()

const sinnerName = computed<string>(
  () => SINNER_TO_NAME[<keyof typeof SINNER_TO_NAME>sinner.value.sinnerKey]
)

function getSinnerClashSkill(skill: SkillStats): ClashSkill {
  return new ClashSkill(
    skill.basePower,
    skill.numCoins,
    skill.coinPower,
    sinner.value.sanity,
    skill.offenseLevel,
    skill.finalClashPowerModifier,
    sinner.value.paralyzeCount
  )
}

function getWinRate(skill: SkillStats): number {
  const sinnerClashSkill = getSinnerClashSkill(skill)
  return computeClash(sinnerClashSkill, enemyClashSkill.value).winRate
}
function getSinnerClashPowerRange(skill: SkillStats): [number, number] {
  const sinnerClashSkill = getSinnerClashSkill(skill)
  return sinnerClashSkill.clashPowerRange(enemyClashSkill.value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <div>
      <div class="font-bold">
        {{ sinnerName }}: {{ getSinnerIdentityName(sinner.identityOrEgoId) }}
      </div>
      <div>(Uptie {{ sinner.uptie }}, Lv. {{ sinner.level }})</div>
    </div>
    <div class="flex gap-2">
      <div>
        <label>
          Sanity:
          <UInput
            color="blue"
            type="number"
            v-model="sinner.sanity"
            class="ml-1 w-16 inline-block"
          />
        </label>
      </div>
      <div>
        <label>
          Paralyze:
          <UInput
            color="blue"
            type="number"
            v-model="sinner.paralyzeCount"
            class="ml-1 w-16 inline-block"
          />
        </label>
      </div>
    </div>
    <UDivider />
    <div v-for="(skill, index) in sinner.skills" :key="skill.id">
      <div class="font-bold underline">
        {{ getSinnerSkillName(sinner.sinnerKey, skill.id) }}
      </div>
      <div class="flex flex-wrap items-center">
        <div class="text-2xl font-bold">{{ skill.basePower }}</div>
        <div class="ml-0.5">+</div>
        <div
          class="flex ml-0.5 font-bold items-center bg-yellow-500 rounded-full w-10 h-10 text-gray-900"
        >
          <input
            type="number"
            v-model="sinner.skills[index].coinPower"
            class="w-8 inline-block hide-number-spinner text-center bg-yellow-100 rounded-md m-auto outline outline-1 outline-yellow-600"
          />
        </div>
        <div class="font-bold ml-0.5 text-yellow-500">
          ×{{ skill.numCoins }}
        </div>
        <div class="ml-0.5 text-sm">({{ skill.offenseLevel }} Off. Lv.)</div>
        <label class="flex ml-0.5 items-center text-sm">
          + Final Mod:
          <UInput
            color="blue"
            type="number"
            size="2xs"
            v-model="sinner.skills[index].finalClashPowerModifier"
            class="ml-1 w-16 inline-block"
          />
        </label>
        <div class="ml-1 text-sm">
          =
          <span class="font-bold">
            {{ getSinnerClashPowerRange(skill)[0] }}
          </span>
          ~
          <span class="font-bold">
            {{ getSinnerClashPowerRange(skill)[1] }}
          </span>
        </div>
      </div>
      <div>
        Clash win rate:
        <span class="font-bold text-lg">
          {{ (getWinRate(skill) * 100).toFixed(1) }}%
        </span>
        <ClashWinRateText
          class="px-2 rounded-lg inline-block font-bold bg-gray-100 dark:bg-gray-900"
          :win-rate="getWinRate(skill)"
        />
      </div>
    </div>
    <div>
      <UButton
        icon="i-heroicons-minus-circle"
        color="blue"
        variant="soft"
        @click="removeComparisonSinner(sinner)"
      >
        Remove
      </UButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hide-number-spinner {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;
}
</style>
