export const useCustomEnemySkill = () =>
  useState<ComputeClashSkillStats>("customEnemySkill", () => ({
    basePower: 13,
    numCoins: 3,
    coinPower: 2,
    sanity: 0,
    offenseLevel: 40,
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
    sanity: 40,
    paralyzeCount: 0,
  }))
