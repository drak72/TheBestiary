import { parseResponse, type Input, type ModelAdapter} from "../adapter";

type ResponseShape = Record<string, any> & {
  content: { text: string }[]
};

export const claude = {
  format: ({ prompt, imgB64 }: Input) => {
    return JSON.stringify({
      messages: [{
        role: "user",
        content: [{
          type: "image",
          source: {
              type: "base64",
              media_type: "image/jpeg",
              data: imgB64
            }
          },
          {
            type: "text",
            text: `${prompt}`
          }]
      }],
      max_tokens: 1000,
      anthropic_version: "bedrock-2023-05-31"
    });
  },
  parse: (response: ResponseShape) => {
    return parseResponse({
      selector: (parsed) => JSON.parse(parsed.content[0].text),
      response
    })
  }
} as ModelAdapter

