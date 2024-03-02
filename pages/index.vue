<script setup lang="ts">
import { instance as viz } from "@viz-js/viz"
import type { CoinNumberState } from "~/utils/entities"

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

  // Create DOT language representation for the graph
  const dotGraph = `
  digraph G {
    rankdir=LR; // Left to right layout
    label = "State Transition Graph";

    node [shape = doublecircle style = filled]; Win Lose;
    node [shape = circle];

    // Define nodes
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
              )}" color="#000000${Math.round(255 * prob)
                .toString(16)
                .padStart(2, "0")}" fontcolor="#000000${Math.round(255 * prob)
                .toString(16)
                .padStart(2, "0")}"];`
            }
            return ""
          })
          .join("\n")
      )
      .join("\n")}
    Win [fillcolor = springgreen];
    Lose [fillcolor = red fontcolor = white];
  }
`

  // Render the graph using Viz.js
  viz().then((viz) => {
    stateTransitionDiagram.value?.replaceChildren()
    stateTransitionDiagram.value?.appendChild(viz.renderSVGElement(dotGraph))
  })
}

onMounted(() => drawStateTransitionGraph())
watch(() => clashResult.value, drawStateTransitionGraph)
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
    <div>Clash win rate: {{ (clashResult.winRate * 100).toFixed(1) }}%</div>
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
      <p>P(flipping heads) = 0.5 + (sanity / 100)</p>
      <p>
        Clash power = base power + (number of heads * coin power) + max(0,
        floor(self offense level - opponent offense level / 3))
      </p>
      <div ref="stateTransitionDiagram"></div>
      <p>
        Note: The graph may be disconnected if some values are too close to zero
        due to insufficient precision.
      </p>
    </div>
  </div>
</template>
