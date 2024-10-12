export enum ImageModels {
  StableDiffusion = "stability.stable-diffusion-xl-v1",
  StableImageUltra1 = "stability.stable-image-ultra-v1:0",
  StableImageCore1 = "stability.stable-image-core-v1:0",
  StableDiffusion3L = "stability.sd3-large-v1:0",
  TitanImgV2 = "amazon.titan-image-generator-v2:0",
}
export enum TextModels {
  Claude3Haiku = "anthropic.claude-3-haiku-20240307-v1:0",
  Claude3Sonnet = "anthropic.claude-3-sonnet-20240229-v1:0",
}

export const MODEL_MAP = {
  "1": ImageModels.StableDiffusion,
  "2": ImageModels.TitanImgV2,
  "3": TextModels.Claude3Haiku,
  "4": TextModels.Claude3Sonnet,
  "5": ImageModels.StableImageCore1,
  "6": ImageModels.StableImageUltra1,
  "7": ImageModels.StableDiffusion3L,
};

export enum Breakpoints {
  "XSmall" = "xs",
  "Small" = "sm",
  "Medium" = "md",
  "Large" = "lg",
  "XLarge" = "xl",
  "2XLarge" = "2xl",
}
