// ABOUTME: CLI script to generate a description for an existing S3 image.
// ABOUTME: Takes an S3 key path and creates a desc.json using the text model.

import { config } from 'dotenv';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { textModels } from '../lib/models/registry';
import { TextModels } from '../lib/models/types';
import { clientParams } from '../utils/consts';
import { validate } from '../utils/validate';

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

async function generateDescription(s3Key: string): Promise<void> {
  console.log(`Processing: ${s3Key}`);

  // Fetch image
  console.log('  Fetching image...');
  const imgB64 = await fetchImageAsBase64(s3Key);

  // Generate description - use GPT-4o for reliability with vision
  console.log('  Generating description...');
  const modelId = TextModels.GPT4o;
  const adapter = textModels[modelId];
  console.log(`  Using model: ${modelId}`);

  const description = await adapter({ prompt: TEXT_PROMPT, imgB64 });

  // Add metadata
  const fullDescription = {
    ...description,
    textModel: modelId,
    date: Date.now(),
    prompt: 'Backfilled description',
  };

  // Upload
  console.log('  Uploading desc.json...');
  await uploadDescription(s3Key, fullDescription);

  console.log(`  Done: ${s3Key}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run describe <s3-key>');
    console.error('Example: npm run describe \'1769684649921-7-4-"unicorn hippo"-""-"with lasers"-"polynesian"\'');
    process.exit(1);
  }

  for (const key of args) {
    try {
      await generateDescription(key);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
    }
  }
}

main();
