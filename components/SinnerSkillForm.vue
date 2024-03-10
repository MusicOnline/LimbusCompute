<script setup lang="ts">
import { useGetSinnerIdentity } from "~/composables/sinner"
import {
  SinnerIdentityJsonSchema,
  type SinnerIdentity,
} from "~/entities/SinnerIdentity"
import {
  SinnerSkillJsonSchema,
  type SinnerSkill,
  type SkillDataItem,
} from "~/entities/SinnerSkill"
import { SinnerSkillLocaleJsonSchema } from "~/entities/locales/SinnerSkill"

const sinnerToIdentityData = useSinnerToIdentityData()
const sinnerToSkillData = useSinnerToSkillData()
const sinnerToSkillLocale = useSinnerToSkillLocaleEn()

const customSkill = useCustomSinnerSkill()
const customSinnerStats = useCustomSinnerStats()
const sinnerClashSkill = useCustomSinnerClashSkill()
const enemyClashSkill = useCustomEnemyClashSkill()

const isLoadingSinner = ref<boolean>(false)
const selectedSinnerKey = ref<keyof typeof SINNER_TO_NUMBER | null>(null)
const selectedSinnerIdentityId = ref<number | null>(null)
const selectedSinnerSkillId = ref<number | null>(null)

await useFetchSharedSinnerIdentityLocaleEn()
await useFetchSharedSinnerSkillLocaleEn()

const getSinnerIdentity = useGetSinnerIdentity()
const getSinnerSkill = useGetSinnerSkill()
const getSinnerIdentityName = useGetSinnerIdentityName()
const getSinnerSkillName = useGetSinnerSkillName()
const addComparisonSinner = useAddComparisonSinner()

const sinnerIdentity = computed<SinnerIdentity | null>(() =>
  getSinnerIdentity(selectedSinnerKey, selectedSinnerIdentityId)
)

const sinnerIdentitySkills = computed<SinnerSkill[]>(() => {
  if (!sinnerIdentity.value) return []
  return sinnerIdentity.value.attributeList.flatMap(
    (entry) => getSinnerSkill(selectedSinnerKey.value!, entry.skillId) ?? []
  )
})

const sinnerSkillRawDataAtUptie = computed<SkillDataItem | null>(() => {
  if (!selectedSinnerKey.value || !selectedSinnerSkillId.value) return null
  const skill = getSinnerSkill(selectedSinnerKey, selectedSinnerSkillId)
  if (!skill) return null
  return getSinnerSkillRawDataAtUptie(skill, customSinnerStats.value.uptie)
})

const identitiesForSelect = computed<{ value: number; label: string }[]>(() => {
  if (isLoadingSinner.value || !selectedSinnerKey.value) return []
  const identities =
    sinnerToIdentityData.value[selectedSinnerKey.value]?.list || []
  return identities.map((identity) => ({
    value: identity.id,
    label: getSinnerIdentityName(identity.id) ?? `Identity ${identity.id}`,
  }))
})

const skillsForSelect = computed<{ value: number; label: string }[]>(() => {
  if (
    isLoadingSinner.value ||
    !selectedSinnerKey.value ||
    !sinnerToSkillData.value[selectedSinnerKey.value]
  )
    return []
  return sinnerIdentitySkills.value.map((skill) => ({
    value: skill.id,
    label:
      getSinnerSkillName(selectedSinnerKey.value!, skill.id) ??
      `Skill ${skill.id}`,
  }))
})

const sinnerClashPowerRange = computed<[number, number]>(() =>
  sinnerClashSkill.value.clashPowerRange(enemyClashSkill.value)
)

async function changeSinnerAndFetchData() {
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
      const data = SinnerSkillJsonSchema.parse(JSON.parse(<string>response))
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
      const data = SinnerSkillLocaleJsonSchema.parse(
        JSON.parse(<string>response)
      )
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

function updateCustomSinnerSkill() {
  if (!sinnerSkillRawDataAtUptie.value) return

  customSkill.value.basePower = sinnerSkillRawDataAtUptie.value.defaultValue
  customSkill.value.numCoins = sinnerSkillRawDataAtUptie.value.coinList.length
  customSkill.value.coinPower =
    (sinnerSkillRawDataAtUptie.value.coinList[0].operatorType === "ADD"
      ? 1
      : -1) * sinnerSkillRawDataAtUptie.value.coinList[0].scale
  customSkill.value.offenseLevel =
    customSinnerStats.value.level +
    sinnerSkillRawDataAtUptie.value.skillLevelCorrection
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="font-bold text-lg text-center">Sinner</h1>
    <UDivider class="my-2" />
    <div>
      <label for="sinnerStatsUptie"> Uptie Tier: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerStatsUptie"
        v-model.number="customSinnerStats.uptie"
        min="1"
        max="4"
        @change="updateCustomSinnerSkill()"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerStatsLevel"> Level: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerStatsLevel"
        v-model.number="customSinnerStats.level"
        min="1"
        max="40"
        @change="updateCustomSinnerSkill()"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div class="flex items-center">
      <label for="sinnerCharacter"> Character: </label>
      <USelectMenu
        color="yellow"
        id="sinnerCharacter"
        v-model="selectedSinnerKey"
        @change="changeSinnerAndFetchData()"
        class="ml-1 font-bold flex-grow"
        :ui-menu="{ height: 'max-h-fit' }"
        :options="Object.entries(SINNER_TO_NAME)"
        option-attribute="1"
        value-attribute="0"
      />
    </div>
    <div class="flex items-center">
      <label for="sinnerIdentity"> Identity: </label>
      <ClientOnly>
        <USelectMenu
          color="yellow"
          id="sinnerIdentity"
          v-model.number="selectedSinnerIdentityId"
          :disabled="
            !selectedSinnerKey || !sinnerToIdentityData[selectedSinnerKey]
          "
          @change="selectedSinnerSkillId = null"
          class="ml-1 font-bold flex-grow"
          :ui-menu="{ height: 'max-h-fit' }"
          :options="identitiesForSelect"
          value-attribute="value"
        />
      </ClientOnly>
    </div>
    <div class="flex items-center">
      <label for="sinnerSkill"> Skill: </label>
      <ClientOnly>
        <USelectMenu
          color="yellow"
          id="sinnerSkill"
          v-model.number="selectedSinnerSkillId"
          :disabled="
            !selectedSinnerKey ||
            !sinnerToIdentityData[selectedSinnerKey] ||
            !sinnerToSkillData[selectedSinnerKey]
          "
          @change="updateCustomSinnerSkill()"
          :options="skillsForSelect"
          value-attribute="value"
          class="ml-1 font-bold flex-grow"
        />
      </ClientOnly>
    </div>
    <div class="mt-1">
      <ClientOnly>
        <UButton
          class="font-bold"
          icon="i-heroicons-plus-circle"
          color="yellow"
          variant="soft"
          @click="addComparisonSinner(sinnerIdentity)"
          :disabled="!Boolean(sinnerIdentity)"
        >
          Add Identity
        </UButton>
      </ClientOnly>
    </div>
    <UDivider class="my-2" />
    <div>
      <label for="sinnerBasePower"> Base Power: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerBasePower"
        v-model.number="customSkill.basePower"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerNumCoins"> Number of Coins: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerNumCoins"
        v-model.number="customSkill.numCoins"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerCoinPower"> Coin Power: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerCoinPower"
        v-model.number="customSkill.coinPower"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerSanity"> Sanity: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerSanity"
        v-model.number="customSinnerStats.sanity"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerOffenseLevel"> Offense Level: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerOffenseLevel"
        v-model.number="customSkill.offenseLevel"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerFinalClashPowerModifier">
        Final Clash Power Modifier:
      </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerFinalClashPowerModifier"
        v-model.number="customSkill.finalClashPowerModifier"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="sinnerParalyzeCount"> Paralyze Count: </label>
      <UInput
        color="yellow"
        type="number"
        id="sinnerParalyzeCount"
        v-model.number="customSinnerStats.paralyzeCount"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <UDivider class="my-2" />
    <div>
      <span> Clash Power Range: </span>
      <span class="font-bold">
        {{ sinnerClashPowerRange[0] }}
      </span>
      ~
      <span class="font-bold">
        {{ sinnerClashPowerRange[1] }}
      </span>
    </div>
  </div>
</template>
