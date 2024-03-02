import * as z from "zod"

// https://raw.githubusercontent.com/SyxP/ObiterDicta.jl/main/data/StaticData/static-data/personality/personality-10.json

export const TypeSchema = z.enum(["HIT", "PENETRATE", "SLASH"])
export type Type = z.infer<typeof TypeSchema>

export const AtkResistListSchema = z.object({
  type: TypeSchema,
  value: z.number(),
})
export type AtkResistList = z.infer<typeof AtkResistListSchema>

export const ResistInfoSchema = z.object({
  atkResistList: z.array(AtkResistListSchema),
})
export type ResistInfo = z.infer<typeof ResistInfoSchema>

export const ConditionIdListSchema = z.object({
  conditionID: z.string(),
})
export type ConditionIdList = z.infer<typeof ConditionIdListSchema>

export const AddSchema = z.object({
  level: z.number(),
  conditionIDList: z.array(ConditionIdListSchema),
})
export type Add = z.infer<typeof AddSchema>

export const MentalConditionInfoSchema = z.object({
  add: z.array(AddSchema),
  min: z.array(AddSchema),
})
export type MentalConditionInfo = z.infer<typeof MentalConditionInfoSchema>

export const HpSchema = z.object({
  defaultStat: z.number(),
  incrementByLevel: z.number(),
})
export type Hp = z.infer<typeof HpSchema>

export const BreakSectionSchema = z.object({
  sectionList: z.array(z.number()),
})
export type BreakSection = z.infer<typeof BreakSectionSchema>

export const AttributeListSchema = z.object({
  skillId: z.number(),
  number: z.number(),
})
export type AttributeList = z.infer<typeof AttributeListSchema>

export const SinnerIdentitySchema = z.object({
  id: z.number(),
  appearance: z.string(),
  unitKeywordList: z.array(z.string()).nullish(),
  associationList: z.array(z.string()),
  characterId: z.number(),
  panicType: z.number(),
  season: z.number(),
  defenseSkillIDList: z.array(z.number()),
  panicSkillOnErosion: z.number(),
  slotWeightConditionList: z.array(z.string()),
  rank: z.number(),
  hp: HpSchema,
  defCorrection: z.number(),
  minSpeedList: z.array(z.number()),
  maxSpeedList: z.array(z.number()),
  uniqueAttribute: z.string(),
  mentalConditionInfo: MentalConditionInfoSchema,
  breakSection: BreakSectionSchema,
  resistInfo: ResistInfoSchema,
  attributeList: z.array(AttributeListSchema),
  additionalAttachment: z.string().nullish(),
})
export type SinnerIdentity = z.infer<typeof SinnerIdentitySchema>

export const SinnerIdentityJsonSchema = z.object({
  list: z.array(SinnerIdentitySchema),
})
export type SinnerIdentityJson = z.infer<typeof SinnerIdentityJsonSchema>
