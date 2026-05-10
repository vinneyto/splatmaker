import { createServer } from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.MOCK_JOBS_API_PORT ?? 8787);

const jobs = [
  {
    summary: {
      job_id: "job-001",
      status: "succeeded",
      progress_percent: 100,
      created_at: "2026-05-10T09:00:00.000Z",
      updated_at: "2026-05-10T09:20:00.000Z",
    },
    attempt: 1,
    source_ref: "s3://input-bucket/scene-a.zip",
    started_at: "2026-05-10T09:01:00.000Z",
    finished_at: "2026-05-10T09:19:00.000Z",
    output_files: [
      {
        key: "jobs/job-001/model.sog",
        file_name: "model.sog",
        url: "http://localhost:3000/sample.sog",
      },
      {
        key: "jobs/job-001/model.ply",
        file_name: "model.ply",
        url: "http://localhost:3000/sample.ply",
      },
    ],
  },
  {
    summary: {
      job_id: "job-002",
      status: "running",
      progress_percent: 50,
      created_at: "2026-05-10T10:00:00.000Z",
      updated_at: "2026-05-10T10:10:00.000Z",
    },
    attempt: 1,
    source_ref: "s3://input-bucket/scene-b.zip",
    started_at: "2026-05-10T10:01:00.000Z",
    output_files: [
      {
        key: "jobs/job-002/model.sog",
        file_name: "model.sog",
        url: "http://localhost:3000/sample.sog",
      },
    ],
  },
];

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
}

const server = createServer((req, res) => {
  if (!req.url || !req.method) {
    sendJson(res, 400, { error: "bad request" });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/healthz") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/v1/jobs") {
    const status = (url.searchParams.get("status") ?? "").trim().toLowerCase();
    const limit = Math.max(
      1,
      Math.min(200, Number(url.searchParams.get("limit") ?? 100)),
    );
    const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));

    let items = jobs.map((x) => x.summary);
    if (status) {
      items = items.filter((x) => x.status === status);
    }

    sendJson(res, 200, { items: items.slice(offset, offset + limit) });
    return;
  }

  const detailsMatch = url.pathname.match(/^\/v1\/jobs\/([^/]+)$/);
  if (req.method === "GET" && detailsMatch) {
    const jobId = detailsMatch[1];
    const row = jobs.find((x) => x.summary.job_id === jobId);
    if (!row) {
      sendJson(res, 404, { error: "job not found" });
      return;
    }
    sendJson(res, 200, row);
    return;
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`Mock jobs API listening on http://localhost:${PORT}`);
});
