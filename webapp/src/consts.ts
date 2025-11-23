export enum ImageModels {
  StableDiffusion = "stability.stable-diffusion-xl-v1",
  StableImageUltra1 = "stability.stable-image-ultra-v1:0",
  StableImageCore1 = "stability.stable-image-core-v1:0",
  StableDiffusion3L = "stability.sd3-large-v1:0",
  TitanImgV2 = "amazon.titan-image-generator-v2:0",
}
export enum TextModels {
  Claude45Haiku = "anthropic.claude-haiku-4-5-20251001-v1:0",
  Claude45Sonnet = "anthropic.claude-sonnet-4-5-20250929-v1:0",
  Claude41Opus = "anthropic.claude-opus-4-1-20250805-v1:0",
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
};

export enum Breakpoints {
  "XSmall" = "xs",
  "Small" = "sm",
  "Medium" = "md",
  "Large" = "lg",
  "XLarge" = "xl",
  "2XLarge" = "2xl",
}
