import type { SinnerIdentityJson } from "~/entities/SinnerIdentity"
import type { SinnerSkillJson } from "~/entities/SinnerSkill"
import type { SinnerSkillLocaleJson } from "~/entities/locales/SinnerSkill"

export const useSinnerToIdentityData = () =>
  useState<{
    [key: string]: SinnerIdentityJson
  }>("sinnerToIdentityData", () => ({}))

export const useSinnerToSkillData = () =>
  useState<{ [key: string]: SinnerSkillJson }>("sinnerToSkillData", () => ({}))

export const useSinnerToSkillLocale = () =>
  useState<{ [key: string]: SinnerSkillLocaleJson }>(
    "sinnerToSkillLocale",
    () => ({})
  )
