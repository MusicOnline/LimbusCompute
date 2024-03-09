import type {
  SinnerIdentity,
  SinnerIdentityJson,
} from "~/entities/SinnerIdentity"
import type { SinnerSkill, SinnerSkillJson } from "~/entities/SinnerSkill"
import { SinnerIdentityLocaleJsonSchema } from "~/entities/locales/SinnerIdentity"
import {
  SinnerSkillLocaleJsonSchema,
  type SinnerSkillLocaleJson,
} from "~/entities/locales/SinnerSkill"

export const useSinnerToIdentityData = () =>
  useState<{
    [key: string]: SinnerIdentityJson
  }>("sinnerToIdentityData", () => ({}))

export const useSinnerToSkillData = () =>
  useState<{ [key: string]: SinnerSkillJson }>("sinnerToSkillData", () => ({}))

export const useSinnerToSkillLocaleEn = () =>
  useState<{ [key: string]: SinnerSkillLocaleJson }>(
    "sinnerToSkillLocaleEn",
    () => ({})
  )

export const useFetchSharedSinnerIdentityLocaleEn = () =>
  useFetch(
    new URL(SINNER_IDENTITY_LOCALE_EN_FILENAME, LOCALE_EN_ROOT_URL).toString(),
    {
      key: "sharedSinnerIdentityLocaleEn",
      transform(response) {
        return SinnerIdentityLocaleJsonSchema.parse(
          JSON.parse(<string>response)
        )
      },
    }
  )

export const useFetchSharedSinnerSkillLocaleEn = () =>
  useFetch(new URL(SKILL_LOCALE_EN_FILENAME, LOCALE_EN_ROOT_URL).toString(), {
    key: "sharedSinnerSkillLocaleEn",
    transform(response) {
      return SinnerSkillLocaleJsonSchema.parse(JSON.parse(<string>response))
    },
  })

export const useGetSinnerIdentity = () => {
  const sinnerToIdentityData = useSinnerToIdentityData()

  return (
    sinnerKey: MaybeRefOrGetter<string | null>,
    identityId: MaybeRefOrGetter<number | null>
  ): SinnerIdentity | null => {
    const sinnerKeyValue = toValue(sinnerKey)
    const identityIdValue = toValue(identityId)
    if (!sinnerKeyValue || !identityIdValue) return null
    return (
      sinnerToIdentityData.value[sinnerKeyValue]?.list.find(
        (entry) => entry.id === identityIdValue
      ) ?? null
    )
  }
}

export const useGetSinnerSkill = () => {
  const sinnerToSkillData = useSinnerToSkillData()

  return (
    sinnerKey: MaybeRefOrGetter<string | null>,
    skillId: MaybeRefOrGetter<number | null>
  ): SinnerSkill | null => {
    const sinnerKeyValue = toValue(sinnerKey)
    const skillIdValue = toValue(skillId)
    if (!sinnerKeyValue || !skillIdValue) return null
    return (
      sinnerToSkillData.value[sinnerKeyValue]?.list.find(
        (entry) => entry.id === skillIdValue
      ) ?? null
    )
  }
}

export const useGetSinnerIdentitySkills = () => {
  const getSinnerSkill = useGetSinnerSkill()

  return (
    sinnerKey: MaybeRefOrGetter<string | null>,
    sinnerIdentity: MaybeRefOrGetter<SinnerIdentity | null>
  ): SinnerSkill[] => {
    const sinnerKeyValue = toValue(sinnerKey)
    const sinnerIdentityValue = toValue(sinnerIdentity)
    if (!sinnerKeyValue || !sinnerIdentityValue) return []
    return sinnerIdentityValue.attributeList.flatMap(
      (entry) => getSinnerSkill(sinnerKeyValue, entry.skillId) ?? []
    )
  }
}

export const useGetSinnerIdentityName = () => {
  const { data: sharedLocale } = useFetchSharedSinnerIdentityLocaleEn()

  return (identityId: MaybeRefOrGetter<number | null>): string | null => {
    const identityIdValue = toValue(identityId)
    if (!identityIdValue) return null
    return (
      sharedLocale.value?.dataList
        .find((entry) => entry.id === identityIdValue)
        ?.title.replaceAll("\n", " ") ?? null
    )
  }
}

export const useGetSinnerSkillName = () => {
  const { data: sharedLocale } = useFetchSharedSinnerSkillLocaleEn()
  const sinnerToSkillLocale = useSinnerToSkillLocaleEn()

  return (
    sinnerKey: MaybeRefOrGetter<string | null>,
    skillId: MaybeRefOrGetter<number | null>
  ): string | null => {
    const sinnerKeyValue = toValue(sinnerKey)
    const skillIdValue = toValue(skillId)
    if (!sinnerKeyValue || !skillIdValue) return null
    const searchList = (file: SinnerSkillLocaleJson) =>
      file.dataList
        .find((entry) => entry.id === skillIdValue)
        ?.levelList.slice(-1)[0].name ?? null
    if (sharedLocale.value) {
      const sharedFileSkill = searchList(sharedLocale.value)
      if (sharedFileSkill) return sharedFileSkill
    }
    return searchList(sinnerToSkillLocale.value[sinnerKeyValue])
  }
}
