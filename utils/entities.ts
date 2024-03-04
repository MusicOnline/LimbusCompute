export type ClashResult = {
  winRate: number
  states: CoinNumberState[]
  stochasticMatrix: number[][]
  Qmatrix: number[][]
  Rmatrix: number[][]
  Imatrix: number[][]
  fundamentalMatrix: number[][]
  Bmatrix: number[][]
}

export class Clasher {
  basePower: number
  numCoins: number
  sanity: number
  coinPower: number
  offenseLevel: number
  finalClashPowerModifier: number
  paralyzeCount: number

  constructor(
    basePower: number,
    numCoins: number,
    sanity: number,
    coinPower: number,
    offenseLevel: number,
    finalClashPowerModifier: number,
    paralyzeCount: number
  ) {
    this.basePower = basePower
    this.numCoins = numCoins
    this.sanity = sanity
    this.coinPower = coinPower
    this.offenseLevel = offenseLevel
    this.finalClashPowerModifier = finalClashPowerModifier
    this.paralyzeCount = paralyzeCount
  }

  get headsChance(): number {
    return 0.5 + this.sanity / 100
  }

  clashPower(heads: number, enemy?: Clasher): number {
    if (heads > this.numCoins) {
      throw new Error(`Maximum number of heads is ${this.numCoins}`)
    }

    let offenseLevelModifier = 0

    if (enemy && this.offenseLevel > enemy.offenseLevel) {
      offenseLevelModifier = Math.floor(
        (this.offenseLevel - enemy.offenseLevel) / 3
      )
    }

    return (
      this.basePower +
      heads * this.coinPower +
      offenseLevelModifier +
      this.finalClashPowerModifier
    )
  }
}

export class CoinNumberState {
  constructor(
    public p1: number,
    public p2: number,
    public p1ParalyzeCount: number = 0,
    public p2ParalyzeCount: number = 0
  ) {}

  toString(): string {
    if (this.p1 === 1 && this.p2 === 0) return "Win"
    if (this.p2 === 1 && this.p1 === 0) return "Lose"
    const p1String =
      this.p1.toString() +
      (this.p1ParalyzeCount ? `p${this.p1ParalyzeCount}` : "")
    const p2String =
      this.p2.toString() +
      (this.p2ParalyzeCount ? `p${this.p2ParalyzeCount}` : "")
    return `${p1String},${p2String}`
  }

  sum(): number {
    return this.p1 + this.p2
  }

  includes(element: number): boolean {
    return this.p1 === element || this.p2 === element
  }

  some(
    predicate: (value: number, index: number, array: number[]) => boolean
  ): boolean {
    return [this.p1, this.p2].some(predicate)
  }

  every(
    predicate: (value: number, index: number, array: number[]) => boolean
  ): boolean {
    return [this.p1, this.p2].every(predicate)
  }

  get p1UnparalyzedCoins(): number {
    if (this.p1ParalyzeCount >= this.p1) return 0
    return this.p1 - this.p1ParalyzeCount
  }

  get p2UnparalyzedCoins(): number {
    if (this.p2ParalyzeCount >= this.p2) return 0
    return this.p2 - this.p2ParalyzeCount
  }
}
