// ABOUTME: Type definitions for multi-provider model architecture.
// ABOUTME: Contains model enums, adapter types, and the DescriptionJson structure for creature descriptions.

export enum ImageModels {
  // Bedrock - Stability
  StableCore = 'stability.stable-image-core-v1:0',
  StableUltra = 'stability.stable-image-ultra-v1:0',
  SD3Large = 'stability.sd3-large-v1:0',

  // OpenRouter - Gemini/GPT
  NanoBanana = 'google/gemini-2.5-flash-image',
  NanoBananaPro = 'google/gemini-3-pro-image-preview',
  GPT5Image = 'openai/gpt-5-image',
}

export enum TextModels {
  // All OpenRouter
  Claude45Sonnet = 'anthropic/claude-sonnet-4.5',
  GPT4o = 'openai/gpt-4o',
  Gemini25Flash = 'google/gemini-2.5-flash',
  Llama32Vision90B = 'meta-llama/llama-3.2-90b-vision-instruct',
}

export type ImageAdapter = (input: { prompt: string }) => Promise<string>;

export type TextAdapter = (input: { prompt: string; imgB64: string }) => Promise<DescriptionJson>;

export interface DescriptionJson {
  name: string;
  scientific_name: string;
  habitat: string;
  size: string;
  coloration: string;
  diet: string;
  lifespan: string;
  special_abilities: string;
  fun_fact: string;
}

export const modelMap: Record<ImageModels | TextModels, number> = {
  [ImageModels.StableCore]: 1,
  [ImageModels.StableUltra]: 2,
  [ImageModels.SD3Large]: 3,
  [ImageModels.NanoBanana]: 4,
  [ImageModels.NanoBananaPro]: 5,
  [ImageModels.GPT5Image]: 6,
  [TextModels.Claude45Sonnet]: 7,
  [TextModels.GPT4o]: 8,
  [TextModels.Gemini25Flash]: 9,
  [TextModels.Llama32Vision90B]: 10,
};
