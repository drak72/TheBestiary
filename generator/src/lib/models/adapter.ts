import { stableDiffusionV1, stableDiffusionV2,  } from "./image/stableDiff";
import { titanImgV2 } from "./image/titanv2";
import { claude } from "./text/claude";

export type Input = { prompt: string, imgB64?: string };

/**
 * Interface representing an adapter for model input/output processing
 * @interface
 */
export interface ModelAdapter {
  /**
   * Formats the input prompt according to model requirements
   * @param {Input} params - The input parameters containing the prompt
   * @param {string} params.prompt - The prompt to be formatted
   * @returns {string} The formatted prompt string
   */
  format: ({ prompt }: Input) => string;

  /**
   * Parses the model response into a standardized string format
   * @template T
   * @param {T} response - The model response to be parsed
   * @returns {string} The parsed response string
   */
  parse: <T extends Record<string, any>>(response: T) => string;
}

/**
 * Interface representing parameters for parsing operations.
 * @template T The type of the response value to be parsed.
 * @interface
 * 
 * @property {function} selector - Function that extracts a string value from the parsed response.
 * @param parsedValue - The parsed value of type T.
 * @returns {string} The extracted string value.
 * 
 * @property {T} response - The response value to be parsed.
 */
interface ParseParams<T> {
  selector: (parsedValue: T) => string;
  response: T
}

export const parseResponse = <T extends Record<string, any>>({ selector, response }: ParseParams<T>): string | Record<string, any> => {
  const decodedResponseBody = new TextDecoder().decode(response.body);
  const responseBody = JSON.parse(decodedResponseBody);

  return selector(responseBody);
}

export enum ImageModels {
  // StableDiffusion = 'stability.stable-diffusion-xl-v1', Legacy
  StableImageUltra1 = 'stability.stable-image-ultra-v1:1',
  StableImageCore1 = 'stability.stable-image-core-v1:1',
  StableDiffusion3L = 'stability.sd3-5-large-v1:0',
  TitanImgV2 = 'amazon.titan-image-generator-v2:0',
}

export enum TextModels {
  Claude3Haiku = 'anthropic.claude-3-haiku-20240307-v1:0',
  Claude3Sonnet = 'anthropic.claude-3-sonnet-20240229-v1:0',
}

export const models = {
      // [ImageModels.StableDiffusion]: stableDiffusionV1,
      [ImageModels.TitanImgV2]: titanImgV2,
      [ImageModels.StableImageCore1]: stableDiffusionV2,
      [ImageModels.StableImageUltra1]: stableDiffusionV2,
      [ImageModels.StableDiffusion3L]: stableDiffusionV2,
      [TextModels.Claude3Haiku]: claude,
      [TextModels.Claude3Sonnet]: claude,
  }

  export const modelMap = {
    // [ImageModels.StableDiffusion]: 1,
    [ImageModels.TitanImgV2]: 2,
    [TextModels.Claude3Haiku]: 3,
    [TextModels.Claude3Sonnet]: 4,
    [ImageModels.StableImageCore1]: 5,
    [ImageModels.StableImageUltra1]: 6,
    [ImageModels.StableDiffusion3L]: 7
  }