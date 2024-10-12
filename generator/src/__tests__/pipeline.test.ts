import { describe, it, expect, vi } from 'vitest';
import { fn } from '../utils/fn';

describe('pipeline', () => {
    // Happy Path Tests
    it('should execute a single function correctly', async () => {
        const addOne = async (n: number) => n + 1;
        const result = await fn.pipeline(addOne)(1);
        expect(result).toBe(2);
    });

    it('should execute multiple functions in order', async () => {
        const addOne = async (n: number) => n + 1;
        const multiplyByTwo = async (n: number) => n * 2;
        const result = await fn.pipeline(addOne, multiplyByTwo)(1);
        expect(result).toBe(4); // (1 + 1) * 2 = 4
    });

    it('should handle different data types', async () => {
        const toString = async (n: number) => n.toString();
        const addExclamation = async (s: string) => s + '!';
        const result = await fn.pipeline(toString, addExclamation)(42);
        expect(result).toBe('42!');
    });

    it('should handle empty function array', async () => {
        const result = await fn.pipeline()(5);
        expect(result).toBe(5);
    });

    it('should maintain execution order with async delays', async () => {
        const steps: number[] = [];
        
        const step1 = async (n: number) => {
            await new Promise(resolve => setTimeout(resolve, 50));
            steps.push(1);
            return n + 1;
        };
        
        const step2 = async (n: number) => {
            await new Promise(resolve => setTimeout(resolve, 10));
            steps.push(2);
            return n + 1;
        };
        
        const result = await fn.pipeline(step1, step2)(0);
        expect(result).toBe(2);
        expect(steps).toEqual([1, 2]);
    });

    // Sad Path Tests
    it('should propagate errors from functions', async () => {
        const throwError = async () => {
            throw new Error('Test error');
        };
        
        await expect(fn.pipeline(throwError)(1)).rejects.toThrow('Test error');
    });

    it('should handle errors in middle of pipeline', async () => {
        const addOne = async (n: number) => n + 1;
        const throwError = async () => {
            throw new Error('Middle error');
        };
        const multiplyByTwo = async (n: number) => n * 2;
        
        await expect(fn.pipeline(addOne, throwError, multiplyByTwo)(1))
            .rejects.toThrow('Middle error');
    });

    it('should handle invalid input types', async () => {
        const requireNumber = async (n: unknown) => {
            if (typeof n !== 'number') {
                throw new TypeError('Input must be a number');
            }
            return n + 1;
        };
        
        await expect(fn.pipeline(requireNumber)('not a number' as any))
            .rejects.toThrow(TypeError);
    });

    it('should handle null/undefined function arguments', async () => {
        //@ts-expect-error - bad inputs
        await expect(fn.pipeline(null)(1)).rejects.toThrow();
        //@ts-expect-error - bad inputs
        await expect(fn.pipeline(undefined)(1)).rejects.toThrow();
    });

    it('should handle non-function arguments', async () => {
        //@ts-expect-error - bad inputs
        await expect(fn.pipeline({ not: 'a function' })(1)).rejects.toThrow();
    });

    // Performance Tests
    it('should handle large number of functions', async () => {
        const functions = Array(1000).fill(async (n: number) => n + 1);
        const result = await fn.pipeline(...functions)(0);
        expect(result).toBe(1000);
    });

    // Spy Tests
    it('should call each function exactly once', async () => {
        const spy1 = vi.fn(async (n: number) => n + 1);
        const spy2 = vi.fn(async (n: number) => n * 2);
        
        await fn.pipeline(spy1, spy2)(1);
        
        expect(spy1).toHaveBeenCalledTimes(1);
        expect(spy2).toHaveBeenCalledTimes(1);
        expect(spy1).toHaveBeenCalledWith(1);
        expect(spy2).toHaveBeenCalledWith(2);
    });
});