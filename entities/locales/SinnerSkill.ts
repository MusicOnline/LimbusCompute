import * as z from "zod"

export const CoinDescSchema = z.object({
  desc: z.string().optional(),
})
export type CoinDesc = z.infer<typeof CoinDescSchema>

export const CoinListItemSchema = z.object({
  coindescs: z.array(CoinDescSchema).optional(),
})
export type CoinList = z.infer<typeof CoinListItemSchema>

export const LevelListItemSchema = z.object({
  level: z.number(),
  name: z.string(),
  abName: z.string().optional(),
  desc: z.string(),
  coinlist: z.array(CoinListItemSchema),
})
export type LevelListItem = z.infer<typeof LevelListItemSchema>

export const SinnerSkillLocaleSchema = z.object({
  id: z.number(),
  levelList: z.array(LevelListItemSchema),
})
export type SinnerSkillLocale = z.infer<typeof SinnerSkillLocaleSchema>

export const SinnerSkillLocaleJsonSchema = z.object({
  dataList: z.array(SinnerSkillLocaleSchema),
})
export type SinnerSkillLocaleJson = z.infer<typeof SinnerSkillLocaleJsonSchema>
