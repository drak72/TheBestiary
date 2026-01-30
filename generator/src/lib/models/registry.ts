// ABOUTME: Model registry mapping enums to provider adapters.
// ABOUTME: Provides selection helpers for random model choices.

import { bedrock } from '../providers/bedrock';
import { openrouter } from '../providers/openrouter';
import { ImageModels, TextModels, ImageAdapter, TextAdapter } from './types';

export const imageModels: Record<ImageModels, ImageAdapter> = {
  [ImageModels.StableCore]: bedrock.image(ImageModels.StableCore),
  [ImageModels.StableUltra]: bedrock.image(ImageModels.StableUltra),
  [ImageModels.SD3Large]: bedrock.image(ImageModels.SD3Large),
  [ImageModels.NanoBanana]: openrouter.image(ImageModels.NanoBanana),
  [ImageModels.NanoBananaPro]: openrouter.image(ImageModels.NanoBananaPro),
  [ImageModels.GPT5Image]: openrouter.image(ImageModels.GPT5Image),
};

export const textModels: Record<TextModels, TextAdapter> = {
  [TextModels.Claude45Sonnet]: openrouter.text(TextModels.Claude45Sonnet),
  [TextModels.GPT4o]: openrouter.text(TextModels.GPT4o),
  [TextModels.Gemini25Flash]: openrouter.text(TextModels.Gemini25Flash),
  [TextModels.Llama32Vision90B]: openrouter.text(TextModels.Llama32Vision90B),
};

export const randomImageModel = (): ImageModels => {
  const keys = Object.keys(imageModels) as ImageModels[];
  return keys[Math.floor(Math.random() * keys.length)];
};

export const randomTextModel = (): TextModels => {
  const keys = Object.keys(textModels) as TextModels[];
  return keys[Math.floor(Math.random() * keys.length)];
};
