import * as z from "zod"

export const BuffOwnerSchema = z.enum([
  "",
  "LowestHpValueAlly1",
  "LowestHpRatioAlly",
  "Self",
  "Target",
  "EveryAlly",
  "Custom",
  "RandomAllyExceptSelf",
  "RandomEnemy2",
])
export type BuffOwner = z.infer<typeof BuffOwnerSchema>

export const AtkTypeSchema = z.enum(["HIT", "NONE", "PENETRATE", "SLASH"])
export type AtkType = z.infer<typeof AtkTypeSchema>

export const OperatorTypeSchema = z.enum(["ADD", "SUB"])
export type OperatorType = z.infer<typeof OperatorTypeSchema>

export const DefTypeSchema = z.enum(["ATTACK", "COUNTER", "EVADE", "GUARD"])
export type DefType = z.infer<typeof DefTypeSchema>

export const ParryingCloseTypeSchema = z.enum(["NEAR"])
export type ParryingCloseType = z.infer<typeof ParryingCloseTypeSchema>

export const SkillMotionSchema = z.enum(["Default", "S1", "S2", "S3", "S4"])
export type SkillMotion = z.infer<typeof SkillMotionSchema>

export const SkillTargetTypeSchema = z.enum(["FRONT"])
export type SkillTargetType = z.infer<typeof SkillTargetTypeSchema>

export const ViewTypeSchema = z.enum(["BATTLE", "ENCOUNTER"])
export type ViewType = z.infer<typeof ViewTypeSchema>

export const SkillTypeSchema = z.enum(["SKILL"])
export type SkillType = z.infer<typeof SkillTypeSchema>

export const BuffDataSchema = z.object({
  buffKeyword: z.string(),
  // target: BuffOwnerSchema.optional(),
  // buffOwner: BuffOwnerSchema.optional(),
  target: z.string().optional(),
  buffOwner: z.string().optional(),
  stack: z.number(),
  turn: z.number(),
  activeRound: z.number().optional(),
  value: z.number().optional(),
})
export type BuffData = z.infer<typeof BuffDataSchema>

export const AbilityScriptListSchema = z.object({
  scriptName: z.string(),
  buffData: BuffDataSchema.optional(),
})
export type AbilityScriptList = z.infer<typeof AbilityScriptListSchema>

export const CoinListSchema = z.object({
  operatorType: OperatorTypeSchema,
  scale: z.number(),
  abilityScriptList: z.array(AbilityScriptListSchema).optional(),
  cutsceneStart: z.boolean().optional(),
  actionIndex: z.number().optional(),
})
export type CoinList = z.infer<typeof CoinListSchema>

export const SkillDataItemSchema = z.object({
  gaksungLevel: z.number(),
  attributeType: z.string(),
  atkType: AtkTypeSchema,
  defType: DefTypeSchema,
  skillTargetType: SkillTargetTypeSchema,
  targetNum: z.number(),
  mpUsage: z.number(),
  skillLevelCorrection: z.number(),
  defaultValue: z.number(),
  canTeamKill: z.boolean(),
  canDuel: z.boolean(),
  canChangeTarget: z.boolean(),
  skillMotion: SkillMotionSchema,
  viewType: ViewTypeSchema,
  parryingCloseType: ParryingCloseTypeSchema,
  coinList: z.array(CoinListSchema),
  abilityScriptList: z.array(AbilityScriptListSchema),
  range: z.number(),
  iconID: z.union([z.string(), z.number()]),
})
export type SkillDataItem = z.infer<typeof SkillDataItemSchema>

export const PartialSkillDataItemSchema = SkillDataItemSchema.partial({
  attributeType: true,
  atkType: true,
  defType: true,
  skillTargetType: true,
  targetNum: true,
  mpUsage: true,
  skillLevelCorrection: true,
  defaultValue: true,
  canTeamKill: true,
  canDuel: true,
  canChangeTarget: true,
  skillMotion: true,
  viewType: true,
  parryingCloseType: true,
  coinList: true,
  abilityScriptList: true,
  range: true,
  iconID: true,
})
export type PartialSkillDataItem = z.infer<typeof PartialSkillDataItemSchema>

export const SinnerSkillSchema = z.object({
  id: z.number(),
  skillType: SkillTypeSchema,
  skillTier: z.number(),
  requireIDList: z.array(z.string()),
  skillData: z.array(z.union([PartialSkillDataItemSchema, z.object({})])),
})
export type SinnerSkill = z.infer<typeof SinnerSkillSchema>

export const SinnerSkillJsonSchema = z.object({
  list: z.array(SinnerSkillSchema),
})
export type SinnerSkillJson = z.infer<typeof SinnerSkillJsonSchema>
