import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { randomInt, selector } from '../utils/selection';

describe('randomInt', () => {
  it('should return a number between 0 and max-1', () => {
    const max = 10;
    const result = randomInt(max);
    expect(result).toBeLessThan(max);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  it('should return 0 when max is 1', () => {
    const result = randomInt(1);
    expect(result).toBe(0);
  });
});

describe('selector', () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should select a single item from array when choices=1', () => {
    const arr = ['a', 'b', 'c'];
    vi.mocked(Math.random).mockReturnValue(0);
    const result = selector(arr);
    expect(typeof result).toBe('string');
    expect(arr).toContain(result);
  });

  it('should return multiple items joined by comma when choices>1', () => {
    const arr = ['a', 'b', 'c'];
    vi.mocked(Math.random)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5);
    const result = selector(arr, 2);
    expect(result.split(', ')).toHaveLength(2);
  });

  it('should work with array of length 1', () => {
    const arr = ['single'];
    const result = selector(arr);
    expect(result).toBe('single');
  });

  it('should throw error for empty array', () => {
    expect(() => selector([])).toThrow('Must provide a non empty array to choose from');
  });

});