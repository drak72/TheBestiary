import { config } from 'dotenv';
import shuffle from 'lodash/shuffle';
import { pipeline, prompt, mail, validate, s3, model } from './utils/index'

import { ImageModels, models, TextModels } from "./lib/models/adapter";
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


export const main = async () => {
  const date = new Date();

  /** Pick the models to be utilized */
  const [imageModel] = shuffle(Object.values(ImageModels));
  const [textModel] = shuffle(Object.values(TextModels));

  const imgAdapter = models[imageModel as ImageModels];
  const txtAdapter = models[textModel as TextModels];

  // This changes the prompt to grow the content alongside my daughter. 
  const audience = date.getFullYear() - 2020;
  const storageBucket = s3({ Bucket: STORAGE_BUCKET });

   return await pipeline<Generator>(
    prompt.image({
      entity: ENTITY,
      postscript: `it should delight a ${audience} year old.`
    }),
    model.invoke.image(imgAdapter),
    storageBucket.upload.image,
    prompt.text,
    model.invoke.text(txtAdapter),
    storageBucket.upload.text,
    storageBucket.upload.manifest,
    mail.factSheet({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject: `Daily ${ENTITY}`,
      header: `Your daily ${ENTITY} is here`
    })
  )({
    imageModel: { id: imageModel },
    textModel: { id: textModel },
    timestamp: new Date().valueOf()
  } as Generator)
};

if(process.env.CONTEXT === 'local'){
  main();
};
