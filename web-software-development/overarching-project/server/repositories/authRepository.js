import postgres from "postgres";

const sql = postgres();

export const getUserByEmail = async (email) => {
  const result = await sql`
    SELECT * FROM users WHERE lower(trim(email)) = lower(trim(${email}))
  `;
  return result.length > 0 ? result[0] : null;
};

export const createUser = async (email, passwordHash) => {
  const result = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email
  `;
  return result.length > 0 ? result[0] : null;
};

export const getUserById = async (userId) => {
  const result = await sql`
    SELECT id, email, created_at FROM users WHERE id = ${userId}
  `;
  return result.length > 0 ? result[0] : null;
};
