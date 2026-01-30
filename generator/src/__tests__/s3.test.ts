import { describe, it, expect, vi, beforeEach } from 'vitest';
import { S3Client, GetObjectCommand, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { s3 } from '../utils/s3';
import type { Mock } from 'vitest'
import { ImageModels, modelMap, TextModels } from '../lib/models/types';

// Mock AWS SDK modules
vi.mock('@aws-sdk/client-s3');
vi.mock('@aws-sdk/s3-request-presigner');
vi.mock('@aws-sdk/lib-storage');

// Mock Generator type for testing
const mockGenerator = {
  prompt: {
    subject: 'cat',
    adjectives: 'happy',
    setting: 'garden',
    style: 'watercolor'
  },
  timestamp: 1234567890,
  imageModel: {
    id: ImageModels.StableCore,
    output: 'base64EncodedImage',
    input: {
      prompt: 'A happy cat in a garden, watercolor style'
    }
  },
  textModel: {
    id: TextModels.Claude45Sonnet,
    input: {
        prompt: ''
    },
    output: {
      description: 'A beautiful watercolor painting of a happy cat'
    }
  }
};

describe('S3 Functions', () => {
  const testBucket = 'test-bucket';
  const s3Instance = s3({ Bucket: testBucket });
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sign', () => {
    it('should generate a signed URL', async () => {
      const mockSignedUrl = 'https://signed-url.example.com';
      (getSignedUrl as Mock).mockResolvedValue(mockSignedUrl);

      const result = await s3Instance.sign({ Key: 'test.png' });

      expect(result).toBe(mockSignedUrl);
      expect(getSignedUrl).toHaveBeenCalledWith(
        expect.any(S3Client),
        expect.any(GetObjectCommand),
        { expiresIn: 604799 }
      );
    });

    it('should handle errors during URL signing', async () => {
      (getSignedUrl as Mock).mockRejectedValue(new Error('Signing failed'));

      await expect(s3Instance.sign({ Key: 'test.png' }))
        .rejects.toThrow('Signing failed');
    });
  });

  describe('upload', () => {
    it('should upload an item successfully', async () => {
      const mockUpload = {
        done: vi.fn().mockResolvedValue(undefined),
        on: vi.fn()
      };
      (Upload as unknown as Mock).mockImplementation(() => mockUpload);

      await s3Instance.upload.item({ 
        Key: 'test.txt', 
        Body: 'test content' 
      });

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: {
          Bucket: testBucket,
          Key: 'test.txt',
          Body: 'test content'
        }
      });
      expect(mockUpload.done).toHaveBeenCalled();
    });

    it('should handle upload errors', async () => {
      const mockUpload = {
        done: vi.fn().mockRejectedValue(new Error('Upload failed')),
        on: vi.fn()
      };
      (Upload as Mock).mockImplementation(() => mockUpload);

      await expect(s3Instance.upload.item({ 
        Key: 'test.txt', 
        Body: 'test content' 
      })).rejects.toThrow('Upload failed');
    });
  });

  describe('uploadImage', () => {
    it('should upload an image with correct key format', async () => {
      const mockUpload = {
        done: vi.fn().mockResolvedValue(undefined),
        on: vi.fn()
      };
      (Upload as unknown as Mock).mockImplementation(() => mockUpload);

      const result = await s3Instance.upload.image(mockGenerator);

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: {
          Bucket: testBucket,
          Key: expect.stringContaining(`1234567890-1-7-\"cat\"-\"happy\"-\"garden\"-\"watercolor\"`),
          Body: expect.any(Buffer)
        }
      });
      expect(result).toBe(mockGenerator);
    });

    it('should throw error if prompt is missing', async () => {
      const invalidGenerator = { ...mockGenerator, prompt: undefined };
      
      await expect(s3Instance.upload.image(invalidGenerator))
        .rejects.toThrow('No image prompt specified');
    });
  });

  describe('uploadText', () => {
    it('should upload text metadata with correct format', async () => {
      const mockUpload = {
        done: vi.fn().mockResolvedValue(undefined),
        on: vi.fn()
      };
      (Upload as unknown as Mock).mockImplementation(() => mockUpload);

      const result = await s3Instance.upload.text(mockGenerator);

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: {
          Bucket: testBucket,
          Key: expect.stringContaining('desc.json'),
          Body: expect.stringContaining('"description"')
        }
      });
      expect(result).toBe(mockGenerator);
    });
  });

  describe('get', () => {
    it('should fetch an object successfully', async () => {
      const mockResponse = { Body: 'test content' };
      (S3Client.prototype.send as Mock).mockResolvedValue(mockResponse);

      const result = await s3Instance.get({ Key: 'test.txt' });

      expect(result).toBe(mockResponse);
      expect(S3Client.prototype.send).toHaveBeenCalledWith(
        expect.any(GetObjectCommand)
      );
    });

    it('should handle get errors', async () => {
      (S3Client.prototype.send as Mock).mockRejectedValue(new Error('Get failed'));

      await expect(s3Instance.get({ Key: 'test.txt' }))
        .rejects.toThrow('Get failed');
    });
  });

  describe('list', () => {
    it('should list objects successfully', async () => {
      const mockContents = [
        { Key: 'file1.txt' },
        { Key: 'file2.txt' }
      ];
      (paginateListObjectsV2 as Mock).mockImplementation(function* () {
        yield { Contents: mockContents };
      });

      const result = await s3Instance.list();

      expect(result).toEqual(['file1.txt', 'file2.txt']);
    });

    it('should handle empty bucket', async () => {
      (paginateListObjectsV2 as Mock).mockImplementation(function* () {
        yield { Contents: [] };
      });

      const result = await s3Instance.list();

      expect(result).toEqual([]);
    });

    it('should handle pagination across multiple pages', async () => {
      const mockContentsPage1 = Array.from({ length: 1000 }, (_, i) => ({ Key: `file${i}.txt` }));
      const mockContentsPage2 = [
        { Key: 'file1000.txt' },
        { Key: 'file1001.txt' }
      ];
      (paginateListObjectsV2 as Mock).mockImplementation(function* () {
        yield { Contents: mockContentsPage1 };
        yield { Contents: mockContentsPage2 };
      });

      const result = await s3Instance.list();

      expect(result).toHaveLength(1002);
      expect(result[0]).toBe('file0.txt');
      expect(result[999]).toBe('file999.txt');
      expect(result[1000]).toBe('file1000.txt');
      expect(result[1001]).toBe('file1001.txt');
    });
  });

  describe('manifest', () => {
    it('should generate and upload manifest successfully', async () => {
      const mockContents = [
        { Key: 'path1/img.png' },
        { Key: 'path2/img.png' },
        { Key: 'other.txt' }
      ];
      (paginateListObjectsV2 as Mock).mockImplementation(function* () {
        yield { Contents: mockContents };
      });
      
      const mockUpload = {
        done: vi.fn().mockResolvedValue(undefined),
        on: vi.fn()
      };
      (Upload as unknown as Mock).mockImplementation(() => mockUpload);

      const result = await s3Instance.upload.manifest(mockGenerator);

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: {
          Bucket: testBucket,
          Key: 'manifest.json',
          Body: expect.stringContaining('path1')
        }
      });
      expect(result).toBe(mockGenerator);
    });

    it('should handle empty bucket when generating manifest', async () => {
      (paginateListObjectsV2 as Mock).mockImplementation(function* () {
        yield { Contents: [] };
      });
      
      const mockUpload = {
        done: vi.fn().mockResolvedValue(undefined),
        on: vi.fn()
      };
      (Upload as unknown as Mock).mockImplementation(() => mockUpload);

      const result = await s3Instance.upload.manifest(mockGenerator);

      expect(Upload).toHaveBeenCalledWith({
        client: expect.any(S3Client),
        params: {
          Bucket: testBucket,
          Key: 'manifest.json',
          Body: '[]'
        }
      });
      expect(result).toBe(mockGenerator);
    });
  });
});