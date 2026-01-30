// ABOUTME: Batch script to backfill descriptions for all images missing desc.json.
// ABOUTME: Reads from a file of S3 keys and processes them with rate limiting.

import { config } from 'dotenv';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { textModels } from '../lib/models/registry';
import { TextModels } from '../lib/models/types';
import { clientParams } from '../utils/consts';
import { validate } from '../utils/validate';
import { readFileSync } from 'fs';

config();

const { STORAGE_BUCKET } = validate.environment(['STORAGE_BUCKET']);

const client = new S3Client(clientParams);

const TEXT_PROMPT = `You are a naturalist scientifically describing a mythical creature as though it were a real animal. This is a picture of a riff on a unicorn. It is ok to invent details here, as it will be presented as fictional.
invent information about it in the following JSON format:
{
  "name": '',
  "scientific_name": '',
  "habitat": '',
  "size": '',
  "coloration": '',
  "diet": '',
  "lifespan": '',
  "special_abilities": '',
  "fun_fact": ''
}`;

async function fetchImageAsBase64(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: STORAGE_BUCKET,
    Key: `${key}/img.png`,
  });

  const response = await client.send(command);
  const bytes = await response.Body?.transformToByteArray();
  if (!bytes) throw new Error(`Failed to fetch image: ${key}/img.png`);

  return Buffer.from(bytes).toString('base64');
}

async function uploadDescription(key: string, description: object): Promise<void> {
  const upload = new Upload({
    client,
    params: {
      Bucket: STORAGE_BUCKET,
      Key: `${key}/desc.json`,
      Body: JSON.stringify(description),
    },
  });

  await upload.done();
}

async function processItem(s3Key: string): Promise<boolean> {
  const imgB64 = await fetchImageAsBase64(s3Key);

  const modelId = TextModels.GPT4o;
  const adapter = textModels[modelId];

  const description = await adapter({ prompt: TEXT_PROMPT, imgB64 });

  const fullDescription = {
    ...description,
    textModel: modelId,
    date: Date.now(),
    prompt: 'Backfilled description',
  };

  await uploadDescription(s3Key, fullDescription);
  return true;
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const inputFile = process.argv[2] || '/tmp/missing-descriptions.txt';
  const startIndex = parseInt(process.argv[3] || '0', 10);

  const keys = readFileSync(inputFile, 'utf-8')
    .split('\n')
    .filter(line => line.trim())
    .slice(startIndex);

  console.log(`Backfilling ${keys.length} items starting from index ${startIndex}`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const idx = startIndex + i;

    try {
      process.stdout.write(`[${idx + 1}/${startIndex + keys.length}] ${key.substring(0, 50)}... `);
      await processItem(key);
      success++;
      console.log('OK');

      // Rate limit: 1 second between requests
      if (i < keys.length - 1) {
        await sleep(1000);
      }
    } catch (error) {
      failed++;
      console.log(`FAILED: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`\nComplete! Success: ${success}, Failed: ${failed}`);
}

main();
