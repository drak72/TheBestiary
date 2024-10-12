import { parseResponse, type Input, type ModelAdapter } from "../adapter";

export type ResponseShapeV1 = Record<string, any> & {
  artifacts: { base64: string }[]
}

export type ResponseShapeV2 = Record<string, any> & {
  seeds?: number[],
  finish_reasons?: string[] | null,
  images?: string[]
}

export const stableDiffusionV1 = {
  format: ({ prompt }: Input) => {
    return JSON.stringify({
        text_prompts:[{
          text: prompt,
          weight: 1
        }],
        cfg_scale: 30,
        steps: 50,
        seed: 0,
        width:1024,
        height: 1024,
        samples:1
      });
  },
  parse: (response: ResponseShapeV1) => {
    return parseResponse<ResponseShapeV1>({
      selector: (parsed) => parsed?.artifacts[0].base64,
      response
    });
  }
} as ModelAdapter;

export const stableDiffusionV2 = {
  format: ({ prompt }: Input) => { 
    return JSON.stringify({
      prompt,
      mode: 'text-to-image',
      aspect_ratio: '1:1',
      output_format: 'png'
    })
  },
  parse: (response: ResponseShapeV2) => {
    return parseResponse<ResponseShapeV2>({
      selector: (parsed) => parsed?.images?.[0], response
    })
  }
}