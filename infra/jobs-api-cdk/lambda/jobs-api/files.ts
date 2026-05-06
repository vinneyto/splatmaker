import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from './config.js';
import { s3 } from './clients.js';
import { OutputFile } from './types.js';

export const getFileUrl = async (key: string): Promise<OutputFile> => {
  if (config.resultPublicBaseUrl) {
    return {
      key,
      file_name: key.split('/').pop() ?? key,
      url: `${config.resultPublicBaseUrl}/${key}`,
    };
  }

  const command = new GetObjectCommand({ Bucket: config.bucketName, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: config.presignTtlSeconds });
  return {
    key,
    file_name: key.split('/').pop() ?? key,
    url,
    expires_at: new Date(Date.now() + config.presignTtlSeconds * 1000).toISOString(),
  };
};
