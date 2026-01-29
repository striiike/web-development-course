import postgres from "postgres";

const sql = postgres();

export async function readAll() {
  return await sql`SELECT * FROM communities ORDER BY id`;
}

export async function readOne(communityId) {
  const result = await sql`SELECT * FROM communities WHERE id = ${communityId}`;
  return result.length > 0 ? result[0] : null;
}

export async function create(name, description, createdBy) {
  const result = await sql`
    INSERT INTO communities (name, description, created_by)
    VALUES (${name}, ${description}, ${createdBy})
    RETURNING *
  `;
  return result[0];
}

export async function remove(communityId, userId) {
  const result = await sql`
    DELETE FROM communities WHERE id = ${communityId} AND created_by = ${userId}
    RETURNING *
  `;
  return result.length > 0 ? result[0] : null;
}
