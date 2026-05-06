import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type JobRow = Record<string, unknown>;
type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled';

type OutputFile = {
  key: string;
  file_name: string;
  url: string;
  expires_at?: string;
};

const app = new Hono();
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const s3 = new S3Client({});

const tableName = process.env.JOBS_TABLE_NAME ?? '';
const bucketName = process.env.RESULT_BUCKET_NAME ?? '';
const resultPublicBaseUrl = (process.env.RESULT_PUBLIC_BASE_URL ?? '').replace(/\/$/, '');
const presignTtlSeconds = Math.max(60, Math.min(86400, Number(process.env.PRESIGN_TTL_SECONDS ?? 3600)));

const STATUS_MAP = new Map<string, JobStatus>([
  ['queued', 'queued'],
  ['pending', 'queued'],
  ['running', 'running'],
  ['in_progress', 'running'],
  ['in-progress', 'running'],
  ['processing', 'running'],
  ['done', 'succeeded'],
  ['completed', 'succeeded'],
  ['success', 'succeeded'],
  ['succeeded', 'succeeded'],
  ['failed', 'failed'],
  ['error', 'failed'],
  ['canceled', 'canceled'],
  ['cancelled', 'canceled'],
]);

const ensureEnv = () => {
  if (!tableName) throw new Error('JOBS_TABLE_NAME is not set');
  if (!bucketName) throw new Error('RESULT_BUCKET_NAME is not set');
};

const normalizeStatus = (raw: unknown): JobStatus => {
  const key = String(raw ?? '').trim().toLowerCase();
  return STATUS_MAP.get(key) ?? 'queued';
};

const toIso = (raw: unknown): string | null => {
  const s = String(raw ?? '').trim();
  if (!s) return null;

  const n = Number(s);
  if (Number.isFinite(n) && /^\d+$/.test(s)) {
    return new Date(n * 1000).toISOString();
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const inferProgressPercent = (status: JobStatus): number => {
  if (status === 'succeeded') return 100;
  if (status === 'running') return 50;
  if (status === 'queued') return 10;
  return 0;
};

const inferOutputKeys = (row: JobRow): string[] => {
  const basePrefixRaw = String(row.s3Output ?? '').trim();
  if (!basePrefixRaw) return [];

  const noScheme = basePrefixRaw.replace(/^s3:\/\//, '');
  const slash = noScheme.indexOf('/');
  if (slash < 0) return [];

  let keyPrefix = noScheme.slice(slash + 1).replace(/\/$/, '');
  const jobId = String(row.uuid ?? '').trim();
  if (jobId && !keyPrefix.includes(jobId)) {
    keyPrefix = `${keyPrefix}/${jobId}`;
  }

  return [`${keyPrefix}/model.splat`, `${keyPrefix}/model.ply`, `${keyPrefix}/model.spz`];
};

const toSummary = (row: JobRow) => {
  const status = normalizeStatus(row.uuidStatus);
  const updatedAt = toIso(row.updatedAt) ?? toIso(row.endTimestamp) ?? toIso(row.startTimestamp) ?? new Date().toISOString();
  const createdAt = toIso(row.startTimestamp) ?? updatedAt;

  return {
    job_id: String(row.uuid ?? ''),
    status,
    progress_percent: inferProgressPercent(status),
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

const getFileUrl = async (key: string): Promise<OutputFile> => {
  if (resultPublicBaseUrl) {
    return {
      key,
      file_name: key.split('/').pop() ?? key,
      url: `${resultPublicBaseUrl}/${key}`,
    };
  }

  const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
  const url = await getSignedUrl(s3, command, { expiresIn: presignTtlSeconds });
  return {
    key,
    file_name: key.split('/').pop() ?? key,
    url,
    expires_at: new Date(Date.now() + presignTtlSeconds * 1000).toISOString(),
  };
};

const getJobDetails = async (jobId: string) => {
  const out = await ddb.send(new GetCommand({ TableName: tableName, Key: { uuid: jobId } }));
  if (!out.Item) return null;

  const row = out.Item as JobRow;
  const summary = toSummary(row);
  const outputKeys = inferOutputKeys(row);
  const output_files = await Promise.all(outputKeys.map((key) => getFileUrl(key)));

  return {
    summary,
    attempt: 1,
    source_ref: String(row.s3Input ?? ''),
    error_message: row.errorMsg ? String(row.errorMsg) : undefined,
    started_at: toIso(row.startTimestamp) ?? undefined,
    finished_at: toIso(row.endTimestamp) ?? undefined,
    output_files,
  };
};

app.get('/healthz', (c) => c.json({ status: 'ok' }));

app.get('/v1/jobs', async (c) => {
  ensureEnv();

  const limit = Math.max(1, Math.min(200, Number(c.req.query('limit') ?? 100)));
  const offset = Math.max(0, Number(c.req.query('offset') ?? 0));
  const statusFilter = (c.req.query('status') ?? '').trim().toLowerCase();

  const out = await ddb.send(new ScanCommand({ TableName: tableName }));
  let items = (out.Items ?? []).map((x) => toSummary(x as JobRow));

  if (statusFilter) {
    items = items.filter((x) => x.status === statusFilter);
  }

  items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

  return c.json({ items: items.slice(offset, offset + limit) });
});

app.get('/v1/jobs/:jobId', async (c) => {
  ensureEnv();

  const details = await getJobDetails(c.req.param('jobId'));
  if (!details) {
    return c.json({ error: 'job not found' }, 404);
  }

  return c.json(details);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'internal server error' }, 500);
});

export const handler = handle(app);
