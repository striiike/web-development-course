import postgres from "postgres";

const sql = postgres();

const create = async (userId, bookId, status) => {
  const result = await sql`
    INSERT INTO reading_progress (user_id, book_id, status)
    VALUES (${userId}, ${bookId}, ${status})
    ON CONFLICT (user_id, book_id)
    DO UPDATE SET
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;
  return result[0];
};

const findUserProgress = async (userId) => {
  return await sql`
    SELECT
      reading_progress.id,
      reading_progress.status,
      reading_progress.created_at,
      reading_progress.updated_at,
      books.id as book_id,
      books.title,
      books.description
    FROM reading_progress
    JOIN books ON reading_progress.book_id = books.id
    WHERE reading_progress.user_id = ${userId}
    ORDER BY reading_progress.updated_at DESC
  `;
};

const findUserProgressByStatus = async (userId, status) => {
  return await sql`
    SELECT
      reading_progress.id,
      reading_progress.status,
      reading_progress.created_at,
      reading_progress.updated_at,
      books.id as book_id,
      books.title,
      books.description
    FROM reading_progress
    JOIN books ON reading_progress.book_id = books.id
    WHERE reading_progress.user_id = ${userId} AND reading_progress.status = ${status}
    ORDER BY reading_progress.updated_at DESC
  `;
};

const findUserProgressForBook = async (userId, bookId) => {
  const result = await sql`
    SELECT * FROM reading_progress
    WHERE user_id = ${userId} AND book_id = ${bookId}
  `;

  return result[0];
};

const deleteProgress = async (userId, bookId) => {
  const result = await sql`
    DELETE FROM reading_progress
    WHERE user_id = ${userId} AND book_id = ${bookId}
    RETURNING *
  `;
  return result[0];
};

export { create, deleteProgress, findUserProgress, findUserProgressByStatus, findUserProgressForBook };