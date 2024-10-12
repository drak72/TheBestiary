import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { ModelAdapter } from "../lib/models/adapter";
import type { Generator } from '../index';
import { bedrockParams } from "./consts";

const client = new BedrockRuntimeClient(bedrockParams);

interface InvokeParams {
   type: 'imageModel' | 'textModel'
}

/**
 * Creates a curried function to invoke an AWS Bedrock model with specified parameters.
 * 
 * @param params - Parameters for model invocation
 * @param params.type - The type of model being invoked
 * @param adapter - Model adapter containing format and parse functions
 * @param adapter.format - Function to format the input data
 * @param adapter.parse - Function to parse the model response
 * @param acc - Generator accumulator object containing model configurations and data
 * @returns A Promise resolving to the updated generator accumulator with model output
 * 
 * @example
 * const textModel = invokeModel({ type: 'textModel' })({ 
 *   format: (input) => JSON.stringify(input),
 *   parse: (response) => JSON.parse(response)
 * });
 * const result = await modelInvoker(generatorState);
 */
 const invokeModel = ({ type }: InvokeParams) => ({ format, parse }: ModelAdapter) => async (acc: Generator) => {

    const apiResponse = await client.send(
        new InvokeModelCommand({
          contentType: "application/json",
          body: format(acc[type].input),
          modelId: acc[type].id
        }),
      );

    acc[type].output ??= parse(apiResponse);
    return acc;
}


export const model = {
    invoke: {
        image: invokeModel({ type: 'imageModel' }),
        text: invokeModel({ type: 'textModel' })
    }
}