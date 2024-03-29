import type { SinnerIdentity } from "~/entities/SinnerIdentity"

export const useComparisonSinners = () =>
  useState<ComparisonSinner[]>("comparisonSinners", () => [])

export const useGetComparisonSinner = () => {
  const comparisonSinners = useComparisonSinners()

  return (identityOrEgoId: MaybeRefOrGetter<number>): ComparisonSinner | null =>
    comparisonSinners.value.find(
      (sinner) => sinner.identityOrEgoId === toValue(identityOrEgoId)
    ) ?? null
}

export const useAddComparisonSinner = () => {
  const comparisonSinners = useComparisonSinners()
  const customSkill = useCustomSinnerSkill()
  const customSinnerStats = useCustomSinnerStats()
  const getSinnerIdentitySkills = useGetSinnerIdentitySkills()

  return (sinnerIdentity: MaybeRefOrGetter<SinnerIdentity | null>) => {
    const sinnerIdentityValue = toValue(sinnerIdentity)
    if (!sinnerIdentityValue) return

    const sinnerKey = <string>(
      Object.keys(SINNER_TO_NUMBER).find(
        (key) =>
          SINNER_TO_NUMBER[<keyof typeof SINNER_TO_NUMBER>key] ===
          sinnerIdentityValue.characterId
      )
    )

    const skills: (SkillStats & { id: number })[] = getSinnerIdentitySkills(
      sinnerKey,
      sinnerIdentityValue
    ).flatMap((skill) => {
      if (
        skill.requireIDList.includes("CheckAwakenLevel3") &&
        customSinnerStats.value.uptie < 3
      )
        return []
      const skillStats = getSinnerSkillRawDataAtUptie(
        skill,
        customSinnerStats.value.uptie
      )

      return {
        id: skill.id,
        basePower: skillStats.defaultValue,
        numCoins: skillStats.coinList.length,
        coinPower:
          (skillStats.coinList[0].operatorType === "ADD" ? 1 : -1) *
          skillStats.coinList[0].scale,
        offenseLevel:
          customSinnerStats.value.level + skillStats.skillLevelCorrection,
        finalClashPowerModifier: customSkill.value.finalClashPowerModifier,
      }
    })
    const newSinner: ComparisonSinner = {
      sinnerKey,
      identityOrEgoId: sinnerIdentityValue.id,
      uptie: customSinnerStats.value.uptie,
      level: customSinnerStats.value.level,
      sanity: customSinnerStats.value.sanity,
      paralyzeCount: customSinnerStats.value.paralyzeCount,
      skills,
    }
    const existingIndex = comparisonSinners.value.findIndex(
      ({ identityOrEgoId }) => identityOrEgoId === newSinner.identityOrEgoId
    )
    if (existingIndex >= 0) {
      comparisonSinners.value.splice(existingIndex, 1, newSinner)
    } else {
      comparisonSinners.value.push(newSinner)
    }
  }
}

export const useRemoveComparisonSinner = () => {
  const comparisonSinners = useComparisonSinners()

  return (sinner: MaybeRefOrGetter<ComparisonSinner>) => {
    const sinnerValue = toValue(sinner)
    if (!sinnerValue) return

    const index = comparisonSinners.value.findIndex(
      ({ identityOrEgoId }) => identityOrEgoId === sinnerValue.identityOrEgoId
    )
    if (index >= 0) comparisonSinners.value.splice(index, 1)
  }
}

export const useUpdateComparisonSinner = () => {
  const comparisonSinners = useComparisonSinners()
  const customSkill = useCustomSinnerSkill()
  const getSinnerIdentity = useGetSinnerIdentity()
  const getSinnerIdentitySkills = useGetSinnerIdentitySkills()

  return (
    sinnerKey: MaybeRefOrGetter<string>,
    identityOrEgoId: MaybeRefOrGetter<number>,
    stats: MaybeRefOrGetter<SinnerStats>
  ) => {
    const customSinnerStats = toRef(stats)

    const sinnerIdentityValue = getSinnerIdentity(sinnerKey, identityOrEgoId)

    if (!sinnerIdentityValue) return

    const skills: (SkillStats & { id: number })[] = getSinnerIdentitySkills(
      sinnerKey,
      sinnerIdentityValue
    ).map((skill) => {
      const skillStats = getSinnerSkillRawDataAtUptie(
        skill,
        customSinnerStats.value.uptie
      )

      return {
        id: skill.id,
        basePower: skillStats.defaultValue,
        numCoins: skillStats.coinList.length,
        coinPower:
          (skillStats.coinList[0].operatorType === "ADD" ? 1 : -1) *
          skillStats.coinList[0].scale,
        offenseLevel:
          customSinnerStats.value.level + skillStats.skillLevelCorrection,
        finalClashPowerModifier: customSkill.value.finalClashPowerModifier,
      }
    })
    const newSinner: ComparisonSinner = {
      sinnerKey: toValue(sinnerKey),
      identityOrEgoId: sinnerIdentityValue.id,
      uptie: customSinnerStats.value.uptie,
      level: customSinnerStats.value.level,
      sanity: customSinnerStats.value.sanity,
      paralyzeCount: customSinnerStats.value.paralyzeCount,
      skills,
    }
    const existingIndex = comparisonSinners.value.findIndex(
      ({ identityOrEgoId }) => identityOrEgoId === newSinner.identityOrEgoId
    )
    if (existingIndex >= 0) {
      comparisonSinners.value.splice(existingIndex, 1, newSinner)
    } else {
      comparisonSinners.value.push(newSinner)
    }
  }
}
