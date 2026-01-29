import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import Redis from "ioredis";
import { levenshteinDistance } from "./grader-utils.js";

const ceil = Math.ceil;
const max = Math.max;
const length = (s) => s.length;

const app = new Hono();
const sql = postgres();

let redis;
if (Deno.env.get("REDIS_HOST")) {
  redis = new Redis(
    Number.parseInt(Deno.env.get("REDIS_PORT")),
    Deno.env.get("REDIS_HOST"),
  );
} else {
  redis = new Redis(6379, "redis");
}

app.use("/*", cors());
app.use("/*", logger());

let consumeEnabled = false;
let grading = false;

const gradeSubmission = async (submissionId) => {
  await sql`
    UPDATE exercise_submissions
    SET grading_status = 'processing'
    WHERE id = ${submissionId}
  `;

  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));

  const result = await sql`
    SELECT source_code, solution_code
    FROM exercise_submissions
    WHERE id = ${submissionId}
  `;

  const submission = result[0].source_code;
  const solution = result[0].solution_code;

  const grade = ceil(100 * (1 - (levenshteinDistance(submission, solution) / max(length(submission), length(solution)))));


  await sql`
    UPDATE exercise_submissions
    SET grading_status = 'graded', grade = ${grade}
    WHERE id = ${submissionId}
  `;
};

const startConsuming = async () => {
  if (grading) return;
  grading = true;

  while (consumeEnabled) {
    const queueSize = await redis.llen("submissions");

    if (queueSize === 0) {
      await new Promise(resolve => setTimeout(resolve, 250));
      continue;
    }

    const submissionId = await redis.lpop("submissions");
    if (submissionId) {
      await gradeSubmission(submissionId);
    }
  }

  grading = false;
};

app.get("/api/status", async (c) => {
  const queueSize = await redis.llen("submissions");
  return c.json({
    queue_size: queueSize,
    consume_enabled: consumeEnabled
  });
});

app.post("/api/consume/enable", async (c) => {
  consumeEnabled = true;
  startConsuming();
  return c.json({ consume_enabled: true });
});

app.post("/api/consume/disable", async (c) => {
  consumeEnabled = false;
  return c.json({ consume_enabled: false });
});

export default app;
