type PipelineFn<Accumulator> = (acc: Accumulator) => Promise<Accumulator>;
type ErrorHandler<Accumulator> = (error: Error, input: Accumulator) => Promise<Accumulator>;

/**
 * Creates an asynchronous pipeline of functions that processes an input value sequentially.
 * Each function in the pipeline takes the result of the previous function as its input.
 * 
 * @template Accumulator - The type of value being processed through the pipeline
 * 
 * @param {...PipelineFn<Accumulator>[]} fns - An array of functions to be executed in sequence. 
 * Each function should accept and return a value of type Accumulator.
 * 
 * @returns {(input: Accumulator, onError?: ErrorHandler<Accumulator>) => Promise<Accumulator>}
 * A function that takes an initial input and an optional error handler, and returns a Promise 
 * that resolves to the final processed value.
 * 
 * @throws {Error} If any function in the pipeline throws an error and no error handler is provided,
 * or if the error handler itself throws an error.
 * 
 * @example
 * const pipeline1 = pipeline(
 *   async (x: number) => x + 1,
 *   async (x: number) => x * 2
 * );
 * const result = await pipeline1(1); // returns 4
 */
export const pipeline =
    <Accumulator>(
        ...fns: PipelineFn<Accumulator>[]
    ): (input: Accumulator, onError?: ErrorHandler<Accumulator>) => Promise<Accumulator> =>
    async (input: Accumulator, onError?: ErrorHandler<Accumulator>) => {
        try {
            return await fns.reduce<Promise<Accumulator>>(async (accumulator, fn) => {
                const acc = await accumulator;
                return await fn(acc);
            }, Promise.resolve(input));
        } catch (error) {
            if (onError && error instanceof Error) {
                const acc = await Promise.resolve(input);
                return await onError(error, acc);
            }
            throw error;
        }
    };

export const fn = {
    pipeline,
};
