import * as z from "zod"

export const SinnerIdentityLocaleSchema = z.object({
  id: z.number(),
  title: z.string(),
  name: z.string(),
  nameWithTitle: z.string(),
  desc: z.string(),
})
export type SinnerIdentityLocale = z.infer<typeof SinnerIdentityLocaleSchema>

export const SinnerIdentityLocaleJsonSchema = z.object({
  dataList: z.array(SinnerIdentityLocaleSchema),
})
export type SinnerIdentityLocaleJson = z.infer<
  typeof SinnerIdentityLocaleJsonSchema
>
