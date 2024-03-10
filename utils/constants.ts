export const DATA_REPOSITORY_ROOT_URL =
  "https://raw.githubusercontent.com/SyxP/ObiterDicta.jl/main/data/"

export const SINNER_IDENTITY_DATA_ROOT_URL = new URL(
  "StaticData/static-data/personality/",
  DATA_REPOSITORY_ROOT_URL
).toString()

export const SINNER_SKILL_DATA_ROOT_URL = new URL(
  "StaticData/static-data/skill/",
  DATA_REPOSITORY_ROOT_URL
).toString()

export const SINNER_IDENTITY_LOCALE_EN_FILENAME = "EN_Personalities.json"
export const SKILL_LOCALE_EN_FILENAME = "EN_Skills.json"

export const LOCALE_EN_ROOT_URL = new URL(
  "Localize/en/",
  DATA_REPOSITORY_ROOT_URL
).toString()

export const SINNER_TO_NUMBER = {
  yisang: 1,
  faust: 2,
  donquixote: 3,
  ryoshu: 4,
  meursault: 5,
  honglu: 6,
  heathcliff: 7,
  ishmael: 8,
  rodion: 9,
  sinclair: 10,
  outis: 11,
  gregor: 12,
}

export const SINNER_TO_NAME = {
  yisang: "Yi Sang",
  faust: "Faust",
  donquixote: "Don Quixote",
  ryoshu: "Ryōshū",
  meursault: "Meursault",
  honglu: "Hong Lu",
  heathcliff: "Heathcliff",
  ishmael: "Ishmael",
  rodion: "Rodion",
  sinclair: "Sinclair",
  outis: "Outis",
  gregor: "Gregor",
}
