import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { randomInt } from '../utils/selection';
import { prompt } from '../utils/prompt';

describe('prompt generation', () => {
  beforeEach(() => {
    vi.mock(import('../utils/selection'), async (importOriginal) => {
     const actual = await importOriginal();
     return {
        ...actual,
        randomInt: vi.fn().mockReturnValue(1)
     }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('image prompt', () => {
    it('should generate valid image prompt with defaults', async () => {
      const acc = { 
        imageModel: {},
        textModel: {}
      };
      
      const result = await prompt.image({ 
        entity: 'unicorn',
        postscript: 'test'
      })(acc);

      expect(result.prompt).toBeDefined();
      expect(result.imageModel.input.prompt).toContain('unicorn');
      expect(result.imageModel.input.prompt).toContain('test');
    });

    it('should preserve existing prompt if already set', async () => {
      const existingPrompt = { subject: 'test' };
      const acc = {
        prompt: existingPrompt,
        imageModel: {},
        textModel: {}
      };

      const result = await prompt.image({ 
        entity: 'unicorn',
        postscript: 'test'
      })(acc);

      expect(result.prompt).toBe(existingPrompt);
    });
  });

  describe('text prompt', () => {
    it('should generate text prompt with image', async () => {
      const acc = {
        imageModel: { output: 'base64image' },
        textModel: {}
      };

      const result = await prompt.text(acc);

      expect(result.textModel.input).toEqual({
        prompt: expect.stringContaining('naturalist'),
        imgB64: 'base64image'
      });
    });

    it('should throw error when no image output exists', async () => {
      const acc = {
        imageModel: { output: null },
        textModel: {}
      };

      await expect(prompt.text(acc)).rejects.toThrow('No valid image found');
    });

    it('should preserve existing text prompt if set', async () => {
      const existingPrompt = { prompt: 'test', imgB64: 'test' };
      const acc = {
        imageModel: { output: 'base64image' },
        textModel: { input: existingPrompt }
      };

      const result = await prompt.text(acc);

      expect(result.textModel.input).toBe(existingPrompt);
    });
  });
});
