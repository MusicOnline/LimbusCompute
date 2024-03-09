export const useCustomEnemySkill = () =>
  useState<ComputeClashSkillStats>("customEnemySkill", () => ({
    basePower: 6,
    numCoins: 4,
    coinPower: 3,
    sanity: 0,
    offenseLevel: 49,
    finalClashPowerModifier: 0,
    paralyzeCount: 0,
  }))

export const useCustomSinnerSkill = () =>
  useState<SkillStats>("customSinnerSkill", () => ({
    basePower: 6,
    numCoins: 3,
    coinPower: 4,
    offenseLevel: 40,
    finalClashPowerModifier: 0,
  }))

export const useCustomSinnerStats = () =>
  useState<SinnerStats>("customSinnerStats", () => ({
    uptie: 4,
    level: 40,
    sanity: 45,
    paralyzeCount: 0,
  }))
