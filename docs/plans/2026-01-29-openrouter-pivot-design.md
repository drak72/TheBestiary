# OpenRouter Pivot Design

## Overview

Pivot from Bedrock-only to multi-provider architecture. OpenRouter becomes primary provider for text models; Bedrock retained for Stability image models alongside OpenRouter's image models.

## Architecture

### Core Pattern

Adapters are self-contained functions: `(input) => Promise<output>`. Each adapter encapsulates formatting, API invocation, and response parsing internally. Model registry maps enum to curried adapter function.

```
┌─────────────────────────────────────────────────────┐
│                    Model Registry                    │
│  { [ModelEnum]: providerAdapter(ModelEnum) }        │
├─────────────────────────────────────────────────────┤
│   ImageModels                   TextModels          │
│   ┌─────────────┐              ┌─────────────┐     │
│   │ StableCore  │──►bedrock    │ Claude45    │──►OR│
│   │ StableUltra │──►bedrock    │ GPT4o       │──►OR│
│   │ NanoBanana  │──►openrouter │ Gemini25    │──►OR│
│   │ NanoBananaPro│──►openrouter│ Llama4Mav   │──►OR│
│   └─────────────┘              └─────────────┘     │
└─────────────────────────────────────────────────────┘
```

### Adapter Interface

```typescript
type ImageAdapter = (input: { prompt: string }) => Promise<string>;  // returns base64
type TextAdapter = (input: { prompt: string; imgB64: string }) => Promise<DescriptionJson>;
```

### Provider Factories

**Bedrock** (`lib/providers/bedrock.ts`):
```typescript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient(bedrockParams);

export const bedrock = {
  image: (model: ImageModels): ImageAdapter => async (input) => {
    const body = formatForModel(model, input);
    const response = await client.send(new InvokeModelCommand({
      modelId: modelIdMap[model],
      body,
      contentType: "application/json",
    }));
    return parseImageResponse(response);
  },
};
```

**OpenRouter** (`lib/providers/openrouter.ts`):
```typescript
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export const openrouter = {
  image: (model: ImageModels): ImageAdapter => async (input) => {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENROUTER_API_KEY}`, ... },
      body: JSON.stringify({
        model: modelIdMap[model],
        messages: [{ role: "user", content: input.prompt }],
        modalities: ["image", "text"],
      }),
    });
    // Images returned in message.images[] array, not message.content
    const data = await response.json();
    const imageBlock = data.choices[0].message.images.find(i => i.type === 'image_url');
    return extractBase64(imageBlock.image_url.url);
  },

  text: (model: TextModels): TextAdapter => async (input) => {
    // Vision message format with base64 image
  },
};
```

### Model Registry

```typescript
// lib/models/types.ts
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
  Llama4Maverick = 'meta-llama/llama-4-maverick',
}

// lib/models/registry.ts
import { bedrock } from '../providers/bedrock';
import { openrouter } from '../providers/openrouter';

export const imageModels = {
  [ImageModels.StableCore]: bedrock.image(ImageModels.StableCore),
  [ImageModels.StableUltra]: bedrock.image(ImageModels.StableUltra),
  [ImageModels.NanoBanana]: openrouter.image(ImageModels.NanoBanana),
  [ImageModels.NanoBananaPro]: openrouter.image(ImageModels.NanoBananaPro),
};

export const textModels = {
  [TextModels.Claude45Sonnet]: openrouter.text(TextModels.Claude45Sonnet),
  [TextModels.GPT4o]: openrouter.text(TextModels.GPT4o),
  [TextModels.Gemini25Flash]: openrouter.text(TextModels.Gemini25Flash),
  [TextModels.Llama4Maverick]: openrouter.text(TextModels.Llama4Maverick),
};

export const randomImageModel = () => {
  const keys = Object.keys(imageModels) as ImageModels[];
  return keys[Math.floor(Math.random() * keys.length)];
};

export const randomTextModel = () => {
  const keys = Object.keys(textModels) as TextModels[];
  return keys[Math.floor(Math.random() * keys.length)];
};
```

### Pipeline Integration

```typescript
// index.ts
import { imageModels, textModels, randomImageModel, randomTextModel } from './lib/models/registry';

const invokeImageModel = async (acc: Generator) => {
  const modelId = randomImageModel();
  const adapter = imageModels[modelId];
  acc.imageModel.id = modelId;
  acc.imageModel.output = await adapter(acc.imageModel.input);
  return acc;
};

const invokeTextModel = async (acc: Generator) => {
  const modelId = randomTextModel();
  const adapter = textModels[modelId];
  acc.textModel.id = modelId;
  acc.textModel.output = await adapter(acc.textModel.input);
  return acc;
};

const generate = pipeline<Generator>(
  prompt.generate(entity),
  invokeImageModel,
  s3.upload.image,
  prompt.describe(descriptionPrompt),
  invokeTextModel,
  ...
);
```

## File Changes

### Delete
- `lib/models/adapter.ts` - Old adapter interface
- `lib/models/text/claude.ts` - Bedrock-specific Claude formatting
- `lib/models/image/*.ts` - Old image adapters (logic moves to bedrock provider)
- `utils/bedrock.ts` - Generic invoker no longer needed

### Create
- `lib/providers/bedrock.ts` - Bedrock adapter factory (image only)
- `lib/providers/openrouter.ts` - OpenRouter adapter factory (image + text)
- `lib/models/registry.ts` - Model maps and selection helpers
- `lib/models/types.ts` - Updated enums (or update existing)

### Modify
- `index.ts` - Pipeline uses new invocation pattern
- `utils/consts.ts` - Keep bedrockParams, remove inference profile stuff
- `webapp/src/consts.ts` - Add new model display names

## Error Handling

Each adapter handles provider-specific errors and rethrows with context:
```typescript
if (!response.ok) {
  throw new Error(`OpenRouter ${model}: ${response.status} - ${await response.text()}`);
}
```

## Environment

- `OPENROUTER_API_KEY` - Already set in .env
- Bedrock continues using IAM auth via bedrockParams

## Testing

Run locally with `CONTEXT=local`. Test each model individually before enabling random selection.
