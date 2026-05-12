import { GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddb } from "./clients.js";
import { config } from "./config.js";
import { getFileUrl, listObjectKeys } from "./files.js";
import { inferOutputPrefixes, toIso, toSummary } from "./mappers.js";
import { JobRow } from "./types.js";

export const listJobs = async (query: {
  limit?: string;
  offset?: string;
  status?: string;
}) => {
  const limit = Math.max(1, Math.min(200, Number(query.limit ?? 100)));
  const offset = Math.max(0, Number(query.offset ?? 0));
  const statusFilter = (query.status ?? "").trim().toLowerCase();

  const out = await ddb.send(new ScanCommand({ TableName: config.tableName }));
  let items = (out.Items ?? []).map((x) => toSummary(x as JobRow));

  if (statusFilter) {
    items = items.filter((x) => x.status === statusFilter);
  }

  items.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
  return { items: items.slice(offset, offset + limit) };
};

export const getJobDetails = async (jobId: string) => {
  const out = await ddb.send(
    new GetCommand({ TableName: config.tableName, Key: { uuid: jobId } }),
  );
  if (!out.Item) return null;

  const row = out.Item as JobRow;
  const summary = toSummary(row);
  const outputPrefixes = inferOutputPrefixes(row);
  const outputKeys = await listObjectKeys(outputPrefixes);
  const output_files = await Promise.all(outputKeys.map((key) => getFileUrl(key)));

  return {
    summary,
    attempt: 1,
    source_ref: String(row.s3Input ?? ""),
    error_message: row.errorMsg ? String(row.errorMsg) : undefined,
    started_at: toIso(row.startTimestamp) ?? undefined,
    finished_at: toIso(row.endTimestamp) ?? undefined,
    output_files,
  };
};
