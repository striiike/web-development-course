import * as readingProgressRepository from "./readingProgressRepository.js";

const createOrUpdateProgress = async (c) => {
  const user = c.get("user");
  const bookId = parseInt(c.req.param("bookId"));
  const { status } = await c.req.json();

  if (!['want_to_read', 'reading', 'finished'].includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  const progress = await readingProgressRepository.create(
    user.id,
    bookId,
    status
  );

  return c.json(progress);
};

const getUserProgressForBook = async (c) => {
  const user = c.get("user");
  const bookId = parseInt(c.req.param("bookId"));
  const progress = await readingProgressRepository.findUserProgressForBook(user.id, bookId);
  return c.json(progress || null);
};

const getUserProgress = async (c) => {
  const user = c.get("user");
  const status = c.req.query("status");

  let progress;
  if (status) {
    progress = await readingProgressRepository.findUserProgressByStatus(user.id, status);
  } else {
    progress = await readingProgressRepository.findUserProgress(user.id);
  }

  return c.json(progress);
};

const deleteProgress = async (c) => {
  const user = c.get("user");
  const bookId = parseInt(c.req.param("bookId"));

  const deleted = await readingProgressRepository.deleteProgress(user.id, bookId);
  return c.json(deleted);
};

export { createOrUpdateProgress, deleteProgress, getUserProgressForBook, getUserProgress };