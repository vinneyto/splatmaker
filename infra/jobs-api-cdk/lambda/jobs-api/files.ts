import { GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "./config.js";
import { s3 } from "./clients.js";
import { OutputFile } from "./types.js";
import { trimTrailingSlash } from "./strings.js";

const shouldSkipKey = (key: string, prefix: string) => {
  if (!key || key.endsWith("/")) return true;

  const relative = key.startsWith(`${prefix}/`)
    ? key.slice(prefix.length + 1)
    : key;

  if (!relative) return true;
  if (relative === "output" || relative.startsWith("output/")) return true;
  if (relative.endsWith("/model.tar.gz") || relative === "model.tar.gz")
    return true;

  return false;
};

export const listObjectKeys = async (prefixes: string[]): Promise<string[]> => {
  const uniqueKeys = new Set<string>();

  for (const prefix of prefixes) {
    let continuationToken: string | undefined;

    do {
      const out = await s3.send(
        new ListObjectsV2Command({
          Bucket: config.bucketName,
          Prefix: prefix,
          ContinuationToken: continuationToken,
          MaxKeys: 1000,
        }),
      );

      for (const item of out.Contents ?? []) {
        const key = item.Key ?? "";
        if (!shouldSkipKey(key, prefix)) {
          uniqueKeys.add(key);
        }
      }

      continuationToken = out.IsTruncated
        ? out.NextContinuationToken
        : undefined;
    } while (continuationToken);
  }

  return [...uniqueKeys].sort();
};

export const getFileUrl = async (
  key: string,
  publicBaseUrl?: string,
): Promise<OutputFile> => {
  const baseUrl = trimTrailingSlash(
    publicBaseUrl ?? config.resultPublicBaseUrl,
  );

  if (baseUrl) {
    return {
      key,
      file_name: key.split("/").pop() ?? key,
      url: `${baseUrl}/${key}`,
    };
  }

  const command = new GetObjectCommand({ Bucket: config.bucketName, Key: key });
  const url = await getSignedUrl(s3, command, {
    expiresIn: config.presignTtlSeconds,
  });
  return {
    key,
    file_name: key.split("/").pop() ?? key,
    url,
    expires_at: new Date(
      Date.now() + config.presignTtlSeconds * 1000,
    ).toISOString(),
  };
};
