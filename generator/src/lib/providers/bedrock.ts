// ABOUTME: Bedrock provider adapter factory for Stability image models.
// ABOUTME: Returns self-contained ImageAdapter functions that handle formatting, invocation, and parsing.

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { bedrockParams } from '../../utils/consts';
import { ImageModels, ImageAdapter } from '../models/types';

const client = new BedrockRuntimeClient(bedrockParams);

interface StabilityV2Response {
  seeds?: number[];
  finish_reasons?: string[] | null;
  images?: string[];
}

const formatRequest = (model: ImageModels, prompt: string): string => {
  // All current Stability models use the same V2 format
  return JSON.stringify({
    prompt,
    mode: 'text-to-image',
    aspect_ratio: '1:1',
    output_format: 'png'
  });
};

const parseResponse = (response: { body: Uint8Array }): string => {
  const decoded = new TextDecoder().decode(response.body);
  const parsed: StabilityV2Response = JSON.parse(decoded);

  if (!parsed.images?.[0]) {
    throw new Error('No image in response');
  }

  return parsed.images[0];
};

export const bedrock = {
  image: (model: ImageModels): ImageAdapter => async (input) => {
    try {
      const response = await client.send(
        new InvokeModelCommand({
          contentType: "application/json",
          body: formatRequest(model, input.prompt),
          modelId: model,
        })
      );

      return parseResponse(response as { body: Uint8Array });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Bedrock ${model}: ${message}`);
    }
  },
};
