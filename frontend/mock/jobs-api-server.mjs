import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { URL } from "node:url";

const PORT = Number(process.env.MOCK_JOBS_API_PORT ?? 8787);
const ASSETS_DIR = new URL("./assets/", import.meta.url).pathname;

const jobs = [
  {
    summary: {
      job_id: "e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be",
      status: "queued",
      progress_percent: 10,
      created_at: "2026-05-09T13:01:42.242Z",
      updated_at: "2026-05-09T14:24:48.666Z",
    },
    attempt: 2,
    source_ref:
      "s3://3dgs-bucket-7oeyjq/media-input/img_2243_e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be.MOV",
    started_at: "2026-05-09T13:01:42.242Z",
    finished_at: "2026-05-09T14:24:48.666Z",
    output_files: [
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.mp4",
        file_name: "img_2243.mp4",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.mp4`,
      },
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.ply",
        file_name: "img_2243.ply",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.ply`,
      },
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.sog",
        file_name: "img_2243.sog",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.sog`,
      },
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.spz",
        file_name: "img_2243.spz",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.spz`,
      },
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.usdz",
        file_name: "img_2243.usdz",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/img_2243.usdz`,
      },
      {
        key: "workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/render_thumbnail.png",
        file_name: "render_thumbnail.png",
        url: `http://localhost:${PORT}/media/workflow-output/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be/render_thumbnail.png`,
      },
    ],
  },
  {
    summary: {
      job_id: "84f2cdd8-2990-4aa9-b583-9bf466c3e431",
      status: "failed",
      progress_percent: 0,
      created_at: "2026-05-08T09:55:57.396Z",
      updated_at: "2026-05-08T10:01:04.933Z",
    },
    attempt: 1,
    source_ref:
      "s3://3dgs-bucket-7oeyjq/media-input/IMG_2202_84f2cdd8-2990-4aa9-b583-9bf466c3e431.MOV",
    started_at: "2026-05-08T09:55:57.396Z",
    finished_at: "2026-05-08T10:01:04.933Z",
    output_files: [],
  },
  {
    summary: {
      job_id: "f5ed0c77-630d-4cad-a977-65043c50debd",
      status: "canceled",
      progress_percent: 0,
      created_at: "2026-04-15T06:24:32.965Z",
      updated_at: "2026-04-15T06:24:33.483Z",
    },
    attempt: 1,
    source_ref:
      "s3://3dgs-bucket-7oeyjq/media-input/IMG_2202_f5ed0c77-630d-4cad-a977-65043c50debd.MOV",
    started_at: "2026-04-15T06:24:32.965Z",
    finished_at: "2026-04-15T06:24:33.483Z",
    output_files: [],
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

function contentTypeFor(pathname) {
  const ext = extname(pathname).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".sog") return "application/octet-stream";
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".ply") return "application/octet-stream";
  if (ext === ".spz") return "application/octet-stream";
  if (ext === ".usdz") return "model/vnd.usdz+zip";
  return "application/octet-stream";
}

async function tryServeMockAsset(req, res, pathname) {
  const match = pathname.match(
    /^\/media\/workflow-output\/e9f62f71-a401-4fe1-a3a3-6c5b4ff1e7be\/(.+)$/,
  );

  if (!match) {
    return false;
  }

  const fileName = match[1];
  const assetPath = join(ASSETS_DIR, fileName);

  try {
    const fileStat = await stat(assetPath);
    if (!fileStat.isFile()) {
      sendJson(res, 404, { error: "asset not found" });
      return true;
    }

    res.writeHead(200, {
      "Content-Type": contentTypeFor(fileName),
      "Content-Length": fileStat.size,
      "Access-Control-Allow-Origin": "*",
    });

    createReadStream(assetPath).pipe(res);
    return true;
  } catch {
    sendJson(res, 404, { error: "asset not found" });
    return true;
  }
}

const server = createServer(async (req, res) => {
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

  if (req.method === "GET" && url.pathname === "/api/healthz") {
    sendJson(res, 200, { status: "ok" });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/v1/jobs") {
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

  const detailsMatch = url.pathname.match(/^\/api\/v1\/jobs\/([^/]+)$/);
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

  if (req.method === "GET") {
    const served = await tryServeMockAsset(req, res, url.pathname);
    if (served) {
      return;
    }
  }

  sendJson(res, 404, { error: "not found" });
});

server.listen(PORT, () => {
  console.log(`Mock jobs API listening on http://localhost:${PORT}`);
});
