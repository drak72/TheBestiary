import { config } from 'dotenv';
import { pipeline, prompt, mail, validate, s3, compress } from './utils/index'
import { imageModels, textModels, randomImageModel, randomTextModel } from './lib/models/registry';
import { ImageModels, TextModels } from './lib/models/types';

config();

const { STORAGE_BUCKET, ENTITY, MAIL_FROM, MAIL_TO } = validate.environment([
  'STORAGE_BUCKET', 'ENTITY', 'MAIL_TO', 'MAIL_FROM'
]);

type ModelInput = { prompt: string, imgB64?: string };
type TextOutput = {
  name: string,
  scientific_name: string,
  habitat: string,
  size: string,
  coloration: string,
  diet: string,
  lifespan: string,
  special_abilities: string,
  fun_fact: string
}

// Pipeline Accumulator
export interface Generator {
    prompt: {
      subject: string,
      adjectives: string,
      setting: string,
      style: string
    },
    imageModel: {
      id: ImageModels,
      input: ModelInput,
      output: string
    },
    textModel: {
      id: TextModels,
      input: ModelInput,
      output: TextOutput
    },
    timestamp: number
};

const invokeImageModel = async (acc: Generator) => {
  const modelId = randomImageModel();
  const adapter = imageModels[modelId];
  acc.imageModel.id = modelId;
  acc.imageModel.output = await adapter(acc.imageModel.input);
  return acc;
};

const invokeTextModel = async (acc: Generator) => {
  const modelId = randomTextModel();
  const adapter = textModels[modelId];
  acc.textModel.id = modelId;
  // imgB64 is populated by prompt.text step before this runs
  acc.textModel.output = await adapter(acc.textModel.input as { prompt: string; imgB64: string });
  return acc;
};

export const main = async () => {
  const date = new Date();

  // This changes the prompt to grow the content alongside my daughter.
  const audience = date.getFullYear() - 2020;
  const storageBucket = s3({ Bucket: STORAGE_BUCKET });

   return await pipeline<Generator>(
    prompt.image({
      entity: ENTITY,
      postscript: `it should delight a ${audience} year old.`
    }),
    invokeImageModel,
    storageBucket.upload.image,
    compress,
    prompt.text,
    invokeTextModel,
    storageBucket.upload.text,
    storageBucket.upload.manifest,
    mail.factSheet({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `Daily ${ENTITY}`,
      header: `Your daily ${ENTITY} is here`
    })
  )({
    imageModel: {},
    textModel: {},
    timestamp: new Date().valueOf()
  } as Generator)
};

if(process.env.CONTEXT === 'local'){
  main();
};
