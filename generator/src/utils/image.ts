import sharp from 'sharp';
import { Generator } from '../index';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_LONG_EDGE_PX = 1568;
const TARGET_QUALITY = 85;

const compressImage = async (base64Image: string): Promise<string> => {
  const imageBuffer = Buffer.from(base64Image, 'base64');
  let quality = TARGET_QUALITY;
  let compressedBuffer = imageBuffer;

  // First, resize if needed
  const metadata = await sharp(imageBuffer).metadata();
  const maxDimension = Math.max(metadata.width || 0, metadata.height || 0);
  
  if (maxDimension > MAX_LONG_EDGE_PX) {
    compressedBuffer = await sharp(imageBuffer)
      .resize(MAX_LONG_EDGE_PX, MAX_LONG_EDGE_PX, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality })
      .toBuffer();
  } else {
    // Convert to JPEG if not already
    compressedBuffer = await sharp(imageBuffer)
      .jpeg({ quality })
      .toBuffer();
  }

  // If still too large, reduce quality iteratively
  while (compressedBuffer.length > MAX_IMAGE_SIZE_BYTES && quality > 50) {
    quality -= 5;
    if (maxDimension > MAX_LONG_EDGE_PX) {
      compressedBuffer = await sharp(imageBuffer)
        .resize(MAX_LONG_EDGE_PX, MAX_LONG_EDGE_PX, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality })
        .toBuffer();
    } else {
      compressedBuffer = await sharp(imageBuffer)
        .jpeg({ quality })
        .toBuffer();
    }
  }

  return compressedBuffer.toString('base64');
};

export const compress = async (acc: Generator): Promise<Generator> => {
  if (!acc.imageModel.output) {
    return acc;
  }

  const originalSize = Buffer.from(acc.imageModel.output, 'base64').length;
  
  // Only compress if over limit
  if (originalSize > MAX_IMAGE_SIZE_BYTES) {
    acc.imageModel.output = await compressImage(acc.imageModel.output);
    const compressedSize = Buffer.from(acc.imageModel.output, 'base64').length;
    console.log(`Image compressed: ${(originalSize / 1024 / 1024).toFixed(2)}MB -> ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
  }

  return acc;
};

