// ABOUTME: Vitest specs for the OpenRouter provider adapters.
// ABOUTME: Verifies request shape (incl. max_tokens cap) and response parsing.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { openrouter } from '../lib/providers/openrouter';
import { ImageModels } from '../lib/models/types';

const okImageResponse = () =>
  new Response(
    JSON.stringify({
      choices: [
        {
          message: {
            images: [
              {
                type: 'image_url',
                image_url: { url: 'data:image/png;base64,UExBQ0VIT0xERVI=' },
              },
            ],
          },
        },
      ],
    }),
    { status: 200, headers: { 'content-type': 'application/json' } }
  );

describe('openrouter.image', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;
  const originalApiKey = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test-key';
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(okImageResponse());
  });

  afterEach(() => {
    fetchSpy.mockRestore();
    if (originalApiKey === undefined) {
      delete process.env.OPENROUTER_API_KEY;
    } else {
      process.env.OPENROUTER_API_KEY = originalApiKey;
    }
  });

  it('caps max_tokens on the request body so OpenRouter cannot reserve a worst-case budget', async () => {
    const adapter = openrouter.image(ImageModels.NanoBanana);

    await adapter({ prompt: 'a glittery unicorn' });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [, init] = fetchSpy.mock.calls[0];
    const body = JSON.parse(init?.body as string);

    expect(body.max_tokens).toBeTypeOf('number');
    expect(body.max_tokens).toBeGreaterThan(0);
    expect(body.max_tokens).toBeLessThanOrEqual(1000);
  });

  it('returns the base64 payload from a data URL image response', async () => {
    const adapter = openrouter.image(ImageModels.NanoBanana);

    const result = await adapter({ prompt: 'a glittery unicorn' });

    expect(result).toBe('UExBQ0VIT0xERVI=');
  });
});
