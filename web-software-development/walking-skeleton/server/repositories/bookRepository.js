import postgres from "postgres";

const sql = postgres();

const findAll = async () => {
  return await sql`SELECT * FROM books ORDER BY created_at DESC`;
};

const findById = async (id) => {
  const result = await sql`SELECT * FROM books WHERE id = ${id}`;
  return result[0];
};

const create = async (book) => {
  // Insert only columns guaranteed to exist in current schema (title, author, isbn)
  const result = await sql`
    INSERT INTO books (title, author, isbn)
    VALUES (${book.title}, ${book.author}, ${book.isbn ?? null})
    RETURNING *
  `;
  return result[0];
};

const deleteById = async (id) => {
  const result = await sql`DELETE FROM books WHERE id = ${id} RETURNING *`;
  return result[0];
};

export { findAll, findById, create, deleteById };
