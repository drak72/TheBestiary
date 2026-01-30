// ABOUTME: OpenRouter provider adapter for image generation and text/vision models.
// ABOUTME: Exposes factory functions that return self-contained adapters for the OpenRouter API.

import { ImageModels, TextModels, ImageAdapter, TextAdapter, DescriptionJson } from '../models/types';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const openrouter = {
  image: (model: ImageModels): ImageAdapter => async (input) => {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: input.prompt }],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter ${model}: ${response.status} - ${text}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;

    console.log('OpenRouter response keys:', Object.keys(data));
    console.log('Message keys:', message ? Object.keys(message) : 'no message');

    // Images are returned in message.images array per OpenRouter docs
    if (message?.images && Array.isArray(message.images)) {
      const imageBlock = message.images.find((img: { type: string }) => img.type === 'image_url');
      if (imageBlock?.image_url?.url) {
        const dataUrl = imageBlock.image_url.url;
        const base64Match = dataUrl.match(/^data:image\/[^;]+;base64,(.+)$/);
        if (base64Match) {
          return base64Match[1];
        }
        return dataUrl;
      }
    }

    // Log full response for debugging if no image found
    console.log('Full response (no image found):', JSON.stringify(data, null, 2));
    throw new Error(`OpenRouter ${model}: No image in response`);
  },

  text: (model: TextModels): TextAdapter => async (input) => {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${input.imgB64}` },
            },
            {
              type: 'text',
              text: input.prompt,
            },
          ],
        }],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenRouter ${model}: ${response.status} - ${text}`);
    }

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error(`OpenRouter ${model}: No text content in response`);
    }

    // Remove markdown code blocks if present
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

    return JSON.parse(text) as DescriptionJson;
  },
};
