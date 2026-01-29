import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import { upgradeWebSocket } from "@hono/hono/deno";
import { streamSSE } from "@hono/hono/streaming";
import { Redis } from "ioredis";
import postgres from "postgres";
import { auth } from "./auth.js";

const app = new Hono();
const sql = postgres();
const redis = new Redis(6379, "redis");

const REPLICA_ID = crypto.randomUUID();

app.use("*", async (c, next) => {
  c.res.headers.set("X-Replica-Id", REPLICA_ID);
  await next();
});

app.use("/*", cors());
app.use("/*", logger());

app.get("/", (c) => c.json({ message: "Hello world!" }));
app.get("/todos", async (c) => {
  const todos = await sql`SELECT * FROM todos`;
  return c.json(todos);
});

app.get("/redis-test", async (c) => {
  let count = await redis.get("test");
  if (!count) {
    count = 0;
  } else {
    count = Number(count);
  }

  count++;

  await redis.set("test", count);
  return c.json({ count });
});

const redisCacheMiddleware = async (c, next) => {
  const cachedResponse = await redis.get(c.req.url);
  if (cachedResponse) {
    const res = JSON.parse(cachedResponse);
    return Response.json(res.json, res);
  }

  await next();

  if (!c.res.ok) {
    return;
  }

  const clonedResponse = c.res.clone();

  const res = {
    status: clonedResponse.status,
    statusText: clonedResponse.statusText,
    headers: Object.fromEntries(clonedResponse.headers),
    json: await clonedResponse.json(),
  };

  await redis.set(c.req.url, JSON.stringify(res));
};

app.get(
  "/hello/*",
  redisCacheMiddleware,
);

app.get(
  "/hello/:name",
  async (c) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return c.json({ message: `Hello ${c.req.param("name")}!` });
  },
);





app.get("/api", (c) => {
  return c.text("Hello new path!");
});







const redisProducer = new Redis(6379, "redis");

const QUEUE_NAME = "users";

app.post("/users", async (c) => {
  const { name } = await c.req.json();
  await redisProducer.lpush(QUEUE_NAME, JSON.stringify({ name }));
  c.status(202);
  return c.body("Accepted");
});

app.get("/api/lgtm-test", (c) => {
  console.log("Hello log collection :)");
  return c.json({ message: "Hello, world!" });
});

app.use("/api/ws-chat", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  return next();
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    return next();
  }

  c.set("user", session.user.name);
  return next();
});


const sockets = new Set();
const streams = new Set();
const activeUsers = new Map(); // Maps stream to authenticated username

app.get(
  "/api/ws-chat",
  upgradeWebSocket((c) => {
    const user = c.get("user");
    return {
      onOpen: (event, ws) => {
        sockets.add(ws);
      },
      onMessage(event, ws) {
        const message = JSON.parse(event.data);
        message.date = Date.now();
        message.message = `${user}: ${message.message}`;

        for (const socket of sockets) {
          socket.send(
            JSON.stringify(message),
          );
        }
      },
      onClose: (event, ws) => {
        sockets.delete(ws);
        ws.close();
      },
      onError: (event, ws) => {
        sockets.delete(ws);
        ws.close();
      },
    };
  }),
);


const notifyActiveUsers = async () => {
  const users = activeUsers.size;

  for (const stream of streams) {
    stream.writeSSE({ data: `Active users: ${users}` });
  }
};

app.use("/api/stats/sse-active-users", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    return c.json({ message: "Unauthorized" });
  }

  return next();
});

app.get("/api/stats/sse-active-users", async (c) => {
  const user = c.get("user");

  return streamSSE(c, async (stream) => {
    streams.add(stream);
    activeUsers.set(stream, user);
    await notifyActiveUsers();

    while (!stream.aborted && !stream.closed) {
      await stream.sleep(1000);
    }

    streams.delete(stream);
    activeUsers.delete(stream);
    await notifyActiveUsers();
  });
});

export default app;
