import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";

import * as todoController from "./todoController.js";
import * as taskController from "./taskController.js";
import * as authController from "./authController.js";
import * as middlewares from "./middlewares.js";
import * as bookController from './controllers/bookController.js';
// import * as readingProgressController from "./readingProgressController.js";
// import * as userController from "./userController.js";


const app = new Hono();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/*", logger());

app.use("/api/secret", middlewares.authenticate);
app.get("/api/secret", (c) => {
  return c.json({ message: "This is a secret message!" });
});

// Admin-only routes
// app.use("/api/admin/*", middlewares.authenticate, middlewares.requireAnyRole("ADMIN"));
// app.get("/api/admin/users", userController.getAllUsers);
// app.get("/api/admin/stats", userController.getSystemStats);

// app.use("/api/reading-progress/*", middlewares.authenticate);
// app.get("/api/reading-progress", readingProgressController.getUserProgress);
// app.get("/api/reading-progress/book/:bookId", readingProgressController.getUserProgressForBook);
// app.post("/api/reading-progress/book/:bookId", readingProgressController.createOrUpdateProgress);
// app.delete("/api/reading-progress/book/:bookId", readingProgressController.deleteProgress);

app.use("/api/todos/*", middlewares.authenticate);
app.post("/api/todos", todoController.create);
app.get("/api/todos", todoController.readAll);
app.get("/api/todos/:todoId", todoController.readOne);
app.put("/api/todos/:todoId", todoController.update);
app.delete("/api/todos/:todoId", todoController.deleteOne);

app.use("/api/todos/:todoId/tasks/*", middlewares.authenticate);
app.post("/api/todos/:todoId/tasks", taskController.create);
app.get("/api/todos/:todoId/tasks", taskController.readAll);
app.get("/api/todos/:todoId/tasks/:taskId", taskController.readOne);
app.put("/api/todos/:todoId/tasks/:taskId", taskController.update);
app.delete("/api/todos/:todoId/tasks/:taskId", taskController.deleteOne);


app.post("/api/auth/register", authController.register);
app.post("/api/auth/login", authController.login);

// Books - public reads, authenticated writes/deletes
app.get('/api/books', bookController.readAll);
app.get('/api/books/:bookId', bookController.readOne);
app.post('/api/books', middlewares.authenticate, bookController.create);
app.delete('/api/books/:bookId', middlewares.authenticate, bookController.deleteOne);

// app.onError((err, c) => {
//   console.error("Error:", err);
//   return c.json({ error: err }, 500);
// });

export default app;