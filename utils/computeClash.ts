import { Clasher, CoinNumberState, type ClashResult } from "./entities"
import { binomialPmf, matrixDot, matrixInverse, matrixSubtract } from "./math"

export default (p1: Clasher, p2: Clasher): ClashResult => {
  const states: CoinNumberState[] = []

  let p1HighestParalyzeAtPrevCoinCount = null
  let p2HighestParalyzeAtPrevCoinCount = null
  for (let i = p1.numCoins; i >= 0; i--) {
    let p1ParalyzeCountNow = p1.paralyzeCount
    if (p1HighestParalyzeAtPrevCoinCount === null) {
      p1HighestParalyzeAtPrevCoinCount = p1ParalyzeCountNow
    } else {
      p1HighestParalyzeAtPrevCoinCount = Math.max(
        0,
        p1HighestParalyzeAtPrevCoinCount - (i + 1)
      )
    }

    if (p2HighestParalyzeAtPrevCoinCount !== null) {
      p2HighestParalyzeAtPrevCoinCount = p2.paralyzeCount + 1
    }

    for (let j = p2.numCoins; j >= 0; j--) {
      if (i === 0 && j === 0) break

      p1ParalyzeCountNow = Math.max(
        0,
        p1HighestParalyzeAtPrevCoinCount - (p2.numCoins - j) * i
      )

      let p2ParalyzeCountNow = p2.paralyzeCount

      if (p2HighestParalyzeAtPrevCoinCount === null) {
        p2HighestParalyzeAtPrevCoinCount = p2ParalyzeCountNow
      } else {
        p2HighestParalyzeAtPrevCoinCount = Math.max(
          0,
          p2HighestParalyzeAtPrevCoinCount - (j + 1)
        )
        p2ParalyzeCountNow = p2HighestParalyzeAtPrevCoinCount
      }

      states.push(
        new CoinNumberState(i, j, p1ParalyzeCountNow, p2ParalyzeCountNow)
      )

      while (p1ParalyzeCountNow > 0 || p2ParalyzeCountNow > 0) {
        p1ParalyzeCountNow = Math.max(0, p1ParalyzeCountNow - (i || 1))
        p2ParalyzeCountNow = Math.max(0, p2ParalyzeCountNow - (j || 1))
        states.push(
          new CoinNumberState(i, j, p1ParalyzeCountNow, p2ParalyzeCountNow)
        )
      }
    }
  }

  states.sort(
    (a, b) =>
      b.sum() - a.sum() ||
      b.p1ParalyzeCount - a.p1ParalyzeCount ||
      b.p2ParalyzeCount - a.p2ParalyzeCount
  )

  const stochasticMatrix: number[][] = Array.from(
    { length: states.length },
    () => Array(states.length).fill(0)
  )

  for (let i = 0; i < states.length; i++) {
    const fromState = states[i]
    for (let j = 0; j < states.length; j++) {
      const toState = states[j]
      let transitionProbability = -999

      const isP1NumCoinsFromAndToEqual = fromState.p1 === toState.p1
      const isP2NumCoinsFromAndToEqual = fromState.p2 === toState.p2
      const isAllNumCoinsFromAndToEqual =
        isP1NumCoinsFromAndToEqual && isP2NumCoinsFromAndToEqual

      const p1Change = toState.p1 - fromState.p1
      const p2Change = toState.p2 - fromState.p2

      if (
        (isP1NumCoinsFromAndToEqual && ![0, -1].includes(p2Change)) ||
        (isP2NumCoinsFromAndToEqual && ![0, -1].includes(p1Change))
      ) {
        // Impossible moves (e.g., 2,2 -> 2,0)
        transitionProbability = 0
      } else if (
        isAllNumCoinsFromAndToEqual &&
        fromState.includes(0) &&
        fromState.some((x) => x > 1)
      ) {
        // No retries if clash ended already
        // 2,0 -> 2,0
        transitionProbability = 0
      } else if (
        isP1NumCoinsFromAndToEqual &&
        fromState.p1 === 0 &&
        ((fromState.p2 > 1 && p2Change === -1) ||
          (fromState.p2 === 1 && p2Change === 0))
      ) {
        // Eventually entering absorbing state (p2 win)
        // 0,2 -> 0,1
        // 0,1 -> 0,1
        transitionProbability = 1
      } else if (
        isP2NumCoinsFromAndToEqual &&
        fromState.p2 === 0 &&
        ((fromState.p1 > 1 && p1Change === -1) ||
          (fromState.p1 === 1 && p1Change === 0))
      ) {
        // Eventually entering absorbing state (p1 win)
        // 2,0 -> 1,0
        // 1,0 -> 1,0
        transitionProbability = 1
      } else {
        const probabilities: number[] = []

        for (let p1Heads = 0; p1Heads <= fromState.p1; p1Heads++) {
          const p1ClashPow = p1.clashPower(p1Heads, p2)
          for (let p2Heads = 0; p2Heads <= fromState.p2; p2Heads++) {
            const p2ClashPow = p2.clashPower(p2Heads, p1)

            if (
              ((isP1NumCoinsFromAndToEqual &&
                !isP2NumCoinsFromAndToEqual &&
                p1ClashPow > p2ClashPow) ||
                (isP2NumCoinsFromAndToEqual &&
                  !isP1NumCoinsFromAndToEqual &&
                  p1ClashPow < p2ClashPow) ||
                (isAllNumCoinsFromAndToEqual && p1ClashPow === p2ClashPow)) &&
              toState.p1ParalyzeCount ===
                Math.max(0, fromState.p1ParalyzeCount - fromState.p1) &&
              toState.p2ParalyzeCount ===
                Math.max(0, fromState.p2ParalyzeCount - fromState.p2)
            ) {
              const p1Prob = binomialPmf(
                p1Heads,
                fromState.p1UnparalyzedCoins,
                p1.headsChance
              )
              const p2Prob = binomialPmf(
                p2Heads,
                fromState.p2UnparalyzedCoins,
                p2.headsChance
              )

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
    Qmatrix,
    Rmatrix,
    Imatrix,
    fundamentalMatrix,
    Bmatrix,
  }
}
