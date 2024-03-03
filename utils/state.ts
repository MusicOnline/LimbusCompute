import type { SinnerIdentityJson } from "~/entities/SinnerIdentity"

export const useSinnerToIdentityData = () =>
  useState<{
    [key: string]: SinnerIdentityJson
  }>("sinnerToIdentityData", () => ({}))

export const useSinnerToSkillData = () =>
  useState<{ [key: string]: any }>("sinnerToSkillData", () => ({}))

export const useSinnerToSkillLocale = () =>
  useState<{ [key: string]: any }>("sinnerToSkillLocale", () => ({}))
