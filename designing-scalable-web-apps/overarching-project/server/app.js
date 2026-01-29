import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";
import Redis from "ioredis";
import { auth } from "./auth.js";

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

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use("/*", cors());
app.use("/*", logger());

const cache = new Map();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return next();
  }

  c.set("user", session.user.name);
  c.set("user_id", session.user.id);
  return next();
});

const cacheMiddleware = async (c, next) => {
  const key = c.req.url;
  
  if (cache.has(key)) {
    const cachedData = cache.get(key);
    return c.json(cachedData);
  }
  
  await next();
  
  if (c.res.ok) {
    const clonedResponse = c.res.clone();
    const data = await clonedResponse.json();
    cache.set(key, data);
  }
};

// Authentication middleware - checks if user is authenticated
const requireAuth = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }
  return next();
};

// GET /api/languages - returns all languages
app.get("/api/languages", cacheMiddleware, async (c) => {
  const languages = await sql`SELECT id, name FROM languages ORDER BY id`;
  return c.json(languages);
});

// GET /api/languages/:id/exercises - returns exercises for a specific language
app.get("/api/languages/:id/exercises", cacheMiddleware, async (c) => {
  const languageId = c.req.param("id");
  const exercises = await sql`
    SELECT id, title, description 
    FROM exercises 
    WHERE language_id = ${languageId}
    ORDER BY id
  `;
  return c.json(exercises);
});

// Protected endpoints - require authentication
app.use("/api/exercises/:id/submissions", requireAuth);
app.use("/api/submissions/:id/status", requireAuth);

// POST /api/exercises/:id/submissions - submit a solution to an exercise
app.post("/api/exercises/:id/submissions", async (c) => {
  const exerciseId = c.req.param("id");
  const body = await c.req.json();
  const sourceCode = body.source_code;

  const result = await sql`
    INSERT INTO exercise_submissions (exercise_id, source_code, grading_status, user_id)
    VALUES (${exerciseId}, ${sourceCode}, 'pending', ${c.get("user_id")})
    RETURNING id
  `;

  const submissionId = result[0].id;

  await redis.rpush("submissions", submissionId.toString());

  return c.json({ id: submissionId });
});

// GET /api/exercises/:id - returns a single exercise by id
app.get("/api/exercises/:id", async (c) => {
  const exerciseId = c.req.param("id");
  const result = await sql`
    SELECT id, title, description
    FROM exercises
    WHERE id = ${exerciseId}
  `;

  if (!result || result.length === 0) {
    return new Response("", { status: 404 });
  }

  return c.json(result[0]);
});

// GET /api/submissions/:id/status - returns grading status and grade for a submission
app.get("/api/submissions/:id/status", async (c) => {
  const submissionId = c.req.param("id");
  const result = await sql`
    SELECT grading_status, grade, user_id
    FROM exercise_submissions
    WHERE id = ${submissionId}
  `;

  if (!result || result.length === 0 || result[0].user_id !== c.get("user_id")) {
    return new Response("", { status: 404 });
  }
  const { user_id, ...rest } = result[0];
  return c.json(rest);
});

app.get("/api/lgtm-test", (c) => {
  console.log("Hello log collection :)");
  return c.json({ message: "Hello, world!" });
});

export default app;
