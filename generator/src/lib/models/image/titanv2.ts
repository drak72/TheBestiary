import { parseResponse, type Input, type ModelAdapter } from "../adapter";

type ResponseShape = Record<string, any> & {
  images: string []
}

export const titanImgV2 = {
  format: ({ prompt }: Input) => {
    return JSON.stringify({
      textToImageParams: {
        text: prompt
      },
      taskType: "TEXT_IMAGE",
      imageGenerationConfig: {
        cfgScale: 8,
        seed:0,
        width: 1024,
        height: 1024,
        numberOfImages: 1
      }
    });
  },
  parse: (response: ResponseShape) => {
    return parseResponse<ResponseShape>({
      selector: (parsed) => parsed.images[0],
      response
    });
  }
} as ModelAdapter