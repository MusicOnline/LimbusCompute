<script setup lang="ts">
const customSkill = useCustomEnemySkill()
const sinnerClashSkill = useCustomSinnerClashSkill()
const enemyClashSkill = useCustomEnemyClashSkill()

const enemyClashPowerRange = computed<[number, number]>(() =>
  enemyClashSkill.value.clashPowerRange(sinnerClashSkill.value)
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="font-bold text-lg text-center">Enemy</h1>
    <UDivider class="my-2" />
    <div>
      <label for="enemyBasePower"> Base Power: </label>
      <UInput
        color="red"
        type="number"
        id="enemyBasePower"
        v-model.number="customSkill.basePower"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemyNumCoins"> Number of Coins: </label>
      <UInput
        color="red"
        type="number"
        id="enemyNumCoins"
        v-model.number="customSkill.numCoins"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemyCoinPower"> Coin Power: </label>
      <UInput
        color="red"
        type="number"
        id="enemyCoinPower"
        v-model.number="customSkill.coinPower"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemySanity"> Sanity: </label>
      <UInput
        color="red"
        type="number"
        id="enemySanity"
        v-model.number="customSkill.sanity"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemyOffenseLevel"> Offense Level: </label>
      <UInput
        color="red"
        type="number"
        id="enemyOffenseLevel"
        v-model.number="customSkill.offenseLevel"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemyFinalClashPowerModifier">
        Final Clash Power Modifier:</label
      >
      <UInput
        color="red"
        type="number"
        id="enemyFinalClashPowerModifier"
        v-model.number="customSkill.finalClashPowerModifier"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <div>
      <label for="enemyParalyzeCount"> Paralyze Count: </label>
      <UInput
        color="red"
        type="number"
        id="enemyParalyzeCount"
        v-model.number="customSkill.paralyzeCount"
        class="w-16 ml-1 font-bold inline-block"
      />
    </div>
    <UDivider class="my-2" />
    <div>
      <span> Clash Power Range: </span>
      <span class="font-bold">
        {{ enemyClashPowerRange[0] }}
      </span>
      ~
      <span class="font-bold">
        {{ enemyClashPowerRange[1] }}
      </span>
    </div>
    <UDivider class="my-2" />
    <div>Note: Abnormalities have 0 Sanity.</div>
  </div>
</template>

<style></style>
