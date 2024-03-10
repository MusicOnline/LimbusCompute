import { ClashSkill } from "~/utils/entities"

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

export const useCustomSinnerClashSkill = () => {
  const customSinnerStats = useCustomSinnerStats()
  const customSinnerSkill = useCustomSinnerSkill()

  return computed<ClashSkill>(
    () =>
      new ClashSkill(
        customSinnerSkill.value.basePower,
        customSinnerSkill.value.numCoins,
        customSinnerSkill.value.coinPower,
        customSinnerStats.value.sanity,
        customSinnerSkill.value.offenseLevel,
        customSinnerSkill.value.finalClashPowerModifier,
        customSinnerStats.value.paralyzeCount
      )
  )
}

export const useCustomEnemyClashSkill = () => {
  const customEnemySkill = useCustomEnemySkill()

  return computed<ClashSkill>(
    () =>
      new ClashSkill(
        customEnemySkill.value.basePower,
        customEnemySkill.value.numCoins,
        customEnemySkill.value.coinPower,
        customEnemySkill.value.sanity,
        customEnemySkill.value.offenseLevel,
        customEnemySkill.value.finalClashPowerModifier,
        customEnemySkill.value.paralyzeCount
      )
  )
}
