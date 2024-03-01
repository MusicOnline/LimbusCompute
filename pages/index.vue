<script setup lang="ts">
const p1Data = ref({
  basePower: 4,
  numCoins: 2,
  sanity: 4,
  coinPower: 11,
  offenseLevel: 36,
})

const p2Data = ref({
  basePower: 4,
  numCoins: 3,
  sanity: 20,
  coinPower: 3,
  offenseLevel: 44,
})

const clashWinRate = computed(() => {
  const p1 = new Character(
    p1Data.value.basePower,
    p1Data.value.numCoins,
    p1Data.value.sanity,
    p1Data.value.coinPower,
    p1Data.value.offenseLevel
  )
  const p2 = new Character(
    p2Data.value.basePower,
    p2Data.value.numCoins,
    p2Data.value.sanity,
    p2Data.value.coinPower,
    p2Data.value.offenseLevel
  )

  console.time("Computed clash win rate")
  const result = getClashWinRate(p1, p2)
  console.timeEnd("Computed clash win rate")
  return result
})
</script>

<template>
  <div>
    <h1>[Limbus Compute] Clash Calculator (WIP)</h1>
    <form>
      <div>
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
    <div>Clash win rate: {{ (clashWinRate * 100).toFixed(1) }}%</div>
  </div>
</template>
