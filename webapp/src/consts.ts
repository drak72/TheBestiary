export enum ImageModels {
  StableDiffusion = "stability.stable-diffusion-xl-v1",
  StableImageUltra1 = "stability.stable-image-ultra-v1:0",
  StableImageCore1 = "stability.stable-image-core-v1:0",
  StableDiffusion3L = "stability.sd3-large-v1:0",
  TitanImgV2 = "amazon.titan-image-generator-v2:0",
  NanoBanana = "google/gemini-2.5-flash-image",
  NanoBananaPro = "google/gemini-3-pro-image-preview",
  GPT5Image = "openai/gpt-5-image",
}
export enum TextModels {
  Claude45Haiku = "anthropic.claude-haiku-4-5-20251001-v1:0",
  Claude45Sonnet = "anthropic.claude-sonnet-4-5-20250929-v1:0",
  Claude41Opus = "anthropic.claude-opus-4-1-20250805-v1:0",
  GPT4o = "openai/gpt-4o",
  Gemini25Flash = "google/gemini-2.5-flash",
  Llama32Vision90B = "meta-llama/llama-3.2-90b-vision-instruct",
}

export const MODEL_MAP = {
  "1": ImageModels.StableDiffusion,
  "2": ImageModels.TitanImgV2,
  "3": TextModels.Claude45Haiku,
  "4": TextModels.Claude45Sonnet,
  "5": ImageModels.StableImageCore1,
  "6": ImageModels.StableImageUltra1,
  "7": ImageModels.StableDiffusion3L,
  "8": TextModels.Claude41Opus,
  "9": ImageModels.NanoBanana,
  "10": ImageModels.NanoBananaPro,
  "11": ImageModels.GPT5Image,
  "12": TextModels.GPT4o,
  "13": TextModels.Gemini25Flash,
  "14": TextModels.Llama32Vision90B,
};

export enum Breakpoints {
  "XSmall" = "xs",
  "Small" = "sm",
  "Medium" = "md",
  "Large" = "lg",
  "XLarge" = "xl",
  "2XLarge" = "2xl",
}
