import { JobRow, JobStatus, JobSummary } from './types.js';

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

export const normalizeStatus = (raw: unknown): JobStatus => {
  const key = String(raw ?? '').trim().toLowerCase();
  return STATUS_MAP.get(key) ?? 'queued';
};

export const toIso = (raw: unknown): string | null => {
  const s = String(raw ?? '').trim();
  if (!s) return null;

  const n = Number(s);
  if (Number.isFinite(n) && /^\d+$/.test(s)) {
    return new Date(n * 1000).toISOString();
  }

  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

export const inferProgressPercent = (status: JobStatus): number => {
  if (status === 'succeeded') return 100;
  if (status === 'running') return 50;
  if (status === 'queued') return 10;
  return 0;
};

export const inferOutputKeys = (row: JobRow): string[] => {
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

export const toSummary = (row: JobRow): JobSummary => {
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
