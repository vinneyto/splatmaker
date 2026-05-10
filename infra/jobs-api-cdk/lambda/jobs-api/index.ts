import { Hono } from "hono";
import { handle } from "hono/aws-lambda";
import { ensureEnv } from "./config.js";
import { getJobDetails, listJobs } from "./repository.js";

const app = new Hono();

app.get("/api/healthz", (c) => c.json({ status: "ok" }));

app.get("/api/v1/jobs", async (c) => {
  ensureEnv();

  const payload = await listJobs({
    limit: c.req.query("limit"),
    offset: c.req.query("offset"),
    status: c.req.query("status"),
  });

  return c.json(payload);
});

app.get("/api/v1/jobs/:jobId", async (c) => {
  ensureEnv();

  const details = await getJobDetails(c.req.param("jobId"));
  if (!details) {
    return c.json({ error: "job not found" }, 404);
  }

  return c.json(details);
});

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "internal server error" }, 500);
});

export const handler = handle(app);
