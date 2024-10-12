import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { ModelAdapter, Input, parseResponse } from '../lib/models/adapter';
import { claude } from '../lib/models/text/claude';
import { ResponseShapeV2, stableDiffusionV1, stableDiffusionV2 } from '../lib/models/image/stableDiff';
import { titanImgV2 } from '../lib/models/image/titanv2';

describe('ModelAdapter Interface Tests', () => {
  // Mock adapter for testingparsed
  let mockAdapter: ModelAdapter;

  beforeEach(() => {
    mockAdapter = {
      format: vi.fn(),
      parse: vi.fn()
    };
  });

  describe('format method', () => {
    it('should accept an input with prompt', () => {
      const input: Input = { prompt: 'test prompt' };
      mockAdapter.format(input);
      expect(mockAdapter.format).toHaveBeenCalledWith(input);
    });

    it('should accept an input with prompt and imgB64', () => {
      const input: Input = { 
        prompt: 'test prompt',
        imgB64: 'base64string'
      };
      mockAdapter.format(input);
      expect(mockAdapter.format).toHaveBeenCalledWith(input);
    });

    it('should handle empty prompt', () => {
      const input: Input = { prompt: '' };
      mockAdapter.format(input);
      expect(mockAdapter.format).toHaveBeenCalledWith(input);
    });

    it('should return a string', () => {
      const input: Input = { prompt: 'test' };
      (mockAdapter.format as Mock).mockReturnValue('formatted string');
      const result = mockAdapter.format(input);
      expect(typeof result).toBe('string');
    });
  });

  describe('parse method', () => {
    it('should accept any record type response', () => {
      const response = { key: 'value' };
      mockAdapter.parse(response);
      expect(mockAdapter.parse).toHaveBeenCalledWith(response);
    });

    it('should return a string', () => {
      const response = { key: 'value' };
      (mockAdapter.parse as Mock).mockReturnValue('parsed string');
      const result = mockAdapter.parse(response);
      expect(typeof result).toBe('string');
    });

    it('should handle empty response object', () => {
      const response = {};
      mockAdapter.parse(response);
      expect(mockAdapter.parse).toHaveBeenCalledWith(response);
    });
  });
});

describe('parseResponse Function Tests', () => {
  it('should parse JSON response correctly', () => {
    const mockResponse = {
      body: new TextEncoder().encode(JSON.stringify({ test: 'value' }))
    };
    
    const result = parseResponse({
      selector: (parsed) => parsed.test,
      response: mockResponse
    });

    expect(result).toBe('value');
  });

  it('should handle complex nested objects', () => {
    const complexData = {
      level1: {
        level2: {
          level3: 'nested value'
        }
      }
    };
    
    const mockResponse = {
      body: new TextEncoder().encode(JSON.stringify(complexData))
    };
    
    const result = parseResponse({
      selector: (parsed) => parsed.level1.level2.level3,
      response: mockResponse
    });

    expect(result).toBe('nested value');
  });

  it('should handle arrays in response', () => {
    const arrayData = {
      items: ['item1', 'item2', 'item3']
    };
    
    const mockResponse = {
      body: new TextEncoder().encode(JSON.stringify(arrayData))
    };
    
    const result = parseResponse({
      selector: (parsed) => parsed.items[0],
      response: mockResponse
    });

    expect(result).toBe('item1');
  });

  it('should throw error for invalid JSON', () => {
    const mockResponse = {
      body: new TextEncoder().encode('invalid json')
    };
    
    expect(() => parseResponse({
      selector: (parsed) => parsed.test,
      response: mockResponse
    })).toThrow();
  });

  it('should throw error for missing selector path', () => {
    const mockResponse = {
      body: new TextEncoder().encode(JSON.stringify({ test: 'value' }))
    };
    
    expect(() => parseResponse({
      selector: (parsed) => parsed.nonexistent.path,
      response: mockResponse
    })).toThrow();
  });
});

describe("Adapter Implementation Tests", () => { 

    const mockResponse = (resp) => { return { body: new TextEncoder().encode(JSON.stringify(resp)) } }
      

    it.each([
        claude,
        stableDiffusionV1,
        stableDiffusionV2,
        titanImgV2
    ])("Should match the format of an adapter", (adapter) => { 
        expect(Object.hasOwn(adapter, 'format')).toBeTruthy();
        expect(Object.hasOwn(adapter, 'parse')).toBeTruthy();
    });


    it.each([
        { adapter: claude, input: { prompt: 'something something!', imgB64: 'asofmasioomv' }, response: mockResponse({ content: [{ text: JSON.stringify('success') }]}) },
        { adapter: stableDiffusionV1, input: { prompt: 'something different!' }, response: mockResponse({ artifacts: [ { base64: 'success' }]}) },
        { adapter: stableDiffusionV2, input: { prompt: 'Yet another test prompt! 2342qfawf @#$%@C'}, response: mockResponse({ images: ['success']}) as Partial<ResponseShapeV2> },
        { adapter: titanImgV2, input: { prompt: 'Xyzzy something something' }, response: mockResponse({ images: ['success'] }) }
    ])("Should properly format and parse", ({ adapter, input, response }) => { 
        const formatted = adapter.format(input);
        const parsed = adapter.parse(response);
        console.dir(parsed);
        expect(typeof formatted).toStrictEqual('string');
        expect(typeof parsed).toStrictEqual('string');
        expect(parsed).toStrictEqual('success');
    })
    
})
