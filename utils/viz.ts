import { instance as viz } from "@viz-js/viz"

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

export function drawStateTransitionGraph(
  clashResult: ClashResult,
  container: HTMLElement | null
) {
  if (!container) return
  const states = clashResult.states.map((state) => state.toString())

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
            clashResult.states[i].every((x) => x > 0) ||
            clashResult.states[i].sum() === 1
        )
        .map((state) => `"${state}" [label="${state}"];`)
        .join("\n")}
  
      // Define edges
      ${modifyStochasticMatrixForPresentation(clashResult)
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
      Win [fillcolor="#00ff7f${Math.round(255 * clashResult.winRate)
        .toString(16)
        .padStart(2, "0")}"];
      Lose [fillcolor="#ff0000${Math.round(255 * (1 - clashResult.winRate))
        .toString(16)
        .padStart(2, "0")}"
        fontcolor=${clashResult.winRate > 0.3 ? "black" : "white"}];
    }
  `

  // Render the graph using Viz.js
  viz().then((viz) => {
    container.replaceChildren()
    container.appendChild(viz.renderSVGElement(dotGraph))
  })
}
