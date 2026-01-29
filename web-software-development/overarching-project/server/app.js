import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
// postgres instance moved into repositories
import * as communityController from "./controllers/communityController.js";
import * as middlewares from "./middlewares.js";
import * as postController from "./controllers/postController.js";
import * as commentController from "./controllers/commentController.js";
import * as voteController from "./controllers/voteController.js";
import * as authController from "./controllers/authController.js";
import * as todoRepository from "./repositories/todoRepository.js";

const app = new Hono();

app.use("/*", cors());
app.use("/*", logger());

let visits = 0;
app.get("/api/visits", (c) => {
  visits++;
  return c.json({ visits });
});

// Auth routes
app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);

// Community routes
app.get("/api/communities", communityController.readAll);
app.get("/api/communities/:communityId", communityController.readOne);
app.post("/api/communities", middlewares.authenticate, communityController.create);
app.delete("/api/communities/:communityId", middlewares.authenticate, communityController.deleteOne);

// Post routes
app.get("/api/communities/:communityId/posts", postController.getAll);
app.get("/api/communities/:communityId/posts/:postId", postController.getOne);
app.post("/api/communities/:communityId/posts", middlewares.authenticate, postController.create);
app.delete("/api/communities/:communityId/posts/:postId", middlewares.authenticate, postController.remove);

// Vote routes for posts
app.post("/api/communities/:communityId/posts/:postId/upvote", middlewares.authenticate, voteController.upvotePost);
app.post("/api/communities/:communityId/posts/:postId/downvote", middlewares.authenticate, voteController.downvotePost);

// Comment routes
app.get("/api/communities/:communityId/posts/:postId/comments", commentController.getAll);
app.post("/api/communities/:communityId/posts/:postId/comments", middlewares.authenticate, commentController.create);
app.delete("/api/communities/:communityId/posts/:postId/comments/:commentId", middlewares.authenticate, commentController.remove);

// Vote routes for comments
app.post("/api/communities/:communityId/posts/:postId/comments/:commentId/upvote", middlewares.authenticate, voteController.upvoteComment);
app.post("/api/communities/:communityId/posts/:postId/comments/:commentId/downvote", middlewares.authenticate, voteController.downvoteComment);

// Homepage route
app.get("/api/homepage", postController.getHomepage);

// retrieving todos from database on requests to /api/todos
app.get("/api/todos", async (c) => {
  const todos = await todoRepository.findAll();
  return c.json(todos);
});

export default app;