import { Clasher, CoinNumberState, type ClashResult } from "./entities"
import { binomialPmf, matrixDot, matrixInverse, matrixSubtract } from "./math"

export default (p1: Clasher, p2: Clasher): ClashResult => {
  const numStates = (p1.numCoins + 1) * (p2.numCoins + 1) - 1
  const states: CoinNumberState[] = []

  for (let i = p1.numCoins; i >= 0; i--) {
    for (let j = p2.numCoins; j >= 0; j--) {
      if (i !== 0 || j !== 0) {
        states.push(new CoinNumberState(i, j))
      }
    }
  }

  states.sort((a, b) => b.sum() - a.sum())

  const stochasticMatrix: number[][] = Array.from({ length: numStates }, () =>
    Array(numStates).fill(0)
  )

  for (let i = 0; i < states.length; i++) {
    const fromState = states[i]
    for (let j = 0; j < states.length; j++) {
      const toState = states[j]
      let transitionProbability = -999

      const isP1Equal = fromState.p1 === toState.p1
      const isP2Equal = fromState.p2 === toState.p2
      const isAllEqual = isP1Equal && isP2Equal

      const p1Change = toState.p1 - fromState.p1
      const p2Change = toState.p2 - fromState.p2

      if (
        (isP1Equal && ![0, -1].includes(p2Change)) ||
        (isP2Equal && ![0, -1].includes(p1Change))
      ) {
        transitionProbability = 0
      } else if (
        isAllEqual &&
        fromState.includes(0) &&
        fromState.some((x) => x > 1)
      ) {
        transitionProbability = 0
      } else if (
        isP1Equal &&
        fromState.p1 === 0 &&
        ((fromState.p2 > 1 && p2Change === -1) ||
          (fromState.p2 === 1 && p2Change === 0))
      ) {
        transitionProbability = 1
      } else if (
        isP2Equal &&
        fromState.p2 === 0 &&
        ((fromState.p1 > 1 && p1Change === -1) ||
          (fromState.p1 === 1 && p1Change === 0))
      ) {
        transitionProbability = 1
      } else {
        const probabilities: number[] = []

        for (let p1Heads = 0; p1Heads <= fromState.p1; p1Heads++) {
          const p1ClashPow = p1.clashPower(p1Heads, p2)
          for (let p2Heads = 0; p2Heads <= fromState.p2; p2Heads++) {
            const p2ClashPow = p2.clashPower(p2Heads, p1)
            if (
              (isP1Equal && !isP2Equal && p1ClashPow > p2ClashPow) ||
              (isP2Equal && !isP1Equal && p1ClashPow < p2ClashPow) ||
              (isAllEqual && p1ClashPow === p2ClashPow)
            ) {
              const p1Prob = binomialPmf(p1Heads, fromState.p1, p1.headsChance)
              const p2Prob = binomialPmf(p2Heads, fromState.p2, p2.headsChance)
              probabilities.push(p1Prob * p2Prob)
            }
          }
        }

        transitionProbability = probabilities.reduce((sum, val) => sum + val, 0)
      }

      stochasticMatrix[i][j] = transitionProbability
    }
  }

  const Qmatrix = stochasticMatrix.slice(0, -2).map((row) => row.slice(0, -2))
  const Rmatrix = stochasticMatrix.slice(0, -2).map((row) => row.slice(-2))
  const Imatrix = Array.from({ length: Qmatrix.length }, (_, i) =>
    Array.from({ length: Qmatrix.length }, (_, j) => (i === j ? 1 : 0))
  )
  const fundamentalMatrix = matrixInverse(matrixSubtract(Imatrix, Qmatrix))
  const Bmatrix = matrixDot(<number[][]>fundamentalMatrix, Rmatrix)
  return {
    winRate: Bmatrix[0][0],
    states,
    stochasticMatrix,
  }
}
