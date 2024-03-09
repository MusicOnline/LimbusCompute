import type {
  PartialSkillDataItem,
  SinnerSkill,
  SkillDataItem,
} from "~/entities/SinnerSkill"

export function getSinnerSkillRawDataAtUptie(
  skill: SinnerSkill,
  uptie: number
): SkillDataItem {
  const brokenDataRemoved = <PartialSkillDataItem[]>(
    skill.skillData.filter((data) => Object.hasOwn(data, "gaksungLevel"))
  ) // See Wsault skill 2 (1050302)
  const skillUpgradeOverrides = brokenDataRemoved.sort(
    (a, b) => a.gaksungLevel - b.gaksungLevel
  )
  let mergedSkill = {}
  skillUpgradeOverrides.forEach((override) => {
    if (override.gaksungLevel <= uptie)
      mergedSkill = { ...mergedSkill, ...override }
  })

  return <SkillDataItem>mergedSkill
}
