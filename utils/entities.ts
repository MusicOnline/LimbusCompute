export class Character {
  basePower: number
  numCoins: number
  sanity: number
  coinPower: number
  offenseLevel: number
  name?: string

  constructor(
    basePower: number,
    numCoins: number,
    sanity: number,
    coinPower: number,
    offenseLevel: number,
    name?: string
  ) {
    this.basePower = basePower
    this.numCoins = numCoins
    this.sanity = sanity
    this.coinPower = coinPower
    this.offenseLevel = offenseLevel
    this.name = name
  }

  toString(): string {
    return `${this.name ?? ""}[${this.basePower} + ${this.numCoins}(${
      this.coinPower >= 0 ? "+" : ""
    }${this.coinPower}); sanity=${this.sanity}; offense_lv=${
      this.offenseLevel
    }]`
  }

  get headsChance(): number {
    return 0.5 + this.sanity / 100
  }

  clashPower(coins: number, heads: number, enemy?: Character): number {
    if (coins > this.numCoins) {
      throw new Error(`Maximum number of coins is ${this.numCoins}`)
    }
    if (heads > coins) {
      throw new Error("Number of heads cannot be more than the number of coins")
    }

    let offenseLevelModifier = 0

    if (enemy && this.offenseLevel > enemy.offenseLevel) {
      offenseLevelModifier = Math.floor(
        (this.offenseLevel - enemy.offenseLevel) / 3
      )
    }

    return (
      this.basePower + heads * this.coinPower + coins * offenseLevelModifier
    )
  }
}

export class CoinNumberState {
  constructor(public p1: number, public p2: number) {}

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
}
