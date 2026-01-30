/** S3 */
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand, GetObjectCommandInput, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { clientParams } from './consts';
import { Generator } from '..';

import assert from 'node:assert';
import { modelMap } from '../lib/models/types';

type BaseParams = { Bucket: string };
type UploadInput = { Key: string, Body: string | Uint8Array | Buffer };


const client = new S3Client(clientParams);
export const sign = ({ Bucket }: BaseParams) => async ({ Key }: { Key: string }) => {
    const s3Command = new GetObjectCommand({ Bucket, Key });
    return await getSignedUrl(client, s3Command, { expiresIn: 604799 });
};

export const upload = ({ Bucket }: { Bucket: string }) =>  async ({ Key, Body }: UploadInput) => {
    const params = {
        Bucket,
        Key,
        Body
    };

    const upload = new Upload({ client, params });

    upload.on('httpUploadProgress', (progress) => {
        console.log('Uploading S3 Object', {
            progress,
            Bucket,
            Key,
        });
    });

    await upload.done();
};


const formatKeyPath = ({ filename, timestamp }: { filename: string, timestamp: number }, acc: Generator) => {
  assert(acc.prompt, `No image prompt specified. Current value: ${JSON.stringify(acc.prompt)}`);
  const { subject, adjectives, setting, style} = acc.prompt;


  const keyPath = `${timestamp}-${modelMap[acc.imageModel.id]}-${modelMap[acc.textModel.id]}-"${subject}"-"${adjectives}"-"${setting}"-"${style}"/${filename}`

  return keyPath;
};

export const uploadImage = ({ Bucket }: { Bucket: string}) =>  async (acc: Generator) => {
  const Key = formatKeyPath({ filename: 'img.png', timestamp: acc.timestamp }, acc);
  await upload({ Bucket })({ Key, Body: Buffer.from(acc.imageModel.output, 'base64') });

  return acc;
}

export const uploadText = ({ Bucket }: { Bucket: string}) => async (acc: Generator) => {
  const Key = formatKeyPath({ filename: 'desc.json', timestamp: acc.timestamp }, acc);
  const { textModel, imageModel } = acc;

  const Body = JSON.stringify({
    ...textModel.output,
    textModel: textModel.id,
    imageModel: imageModel.id,
    date: acc.timestamp,
    prompt: imageModel.input.prompt
  });

  await upload({ Bucket })({ Key, Body });
  return acc;
}

export const get = ({ Bucket }: BaseParams) =>  async ({ Key }: GetObjectCommandInput) => {
    const s3Command = new GetObjectCommand({ Bucket, Key });
    console.log('Fetching S3 Object', {
        Bucket,
        Key,
    });
    return await client.send(s3Command);
};

export const list = ({ Bucket }: BaseParams) => async () => {
  const keys: (string | undefined)[] = [];

  const paginator = paginateListObjectsV2(
    { client },
    { Bucket },
  );

  for await (const page of paginator){
    if (page?.Contents) {
      const pageKeys = page.Contents.map((o) => o.Key);
      keys.push(...pageKeys);
    }
  }

  return keys.filter((key): key is string => key !== undefined);
}

export const manifest = ({ Bucket }: BaseParams) => async (acc: Generator) => { 
    const items = await list({ Bucket })();
    const imgs = items
      .filter((i) => i?.includes('/img.png'))
      .map((i) => { 
        return i?.replace('/img.png', '');
    });

    const sorted = imgs?.sort();
    await upload({ Bucket })({ Key: 'manifest.json', Body: JSON.stringify(sorted)});
    return acc;
};

export const s3 = (params: BaseParams) => {
  return {
    upload: {
      item: upload(params),
      image: uploadImage(params),
      text: uploadText(params),
      manifest: manifest(params)
    },
    get: get(params),
    sign: sign(params),
    list: list(params)
  }
};
