export async function readAll(sql) {
  return await sql`SELECT * FROM communities ORDER BY id`;
}

export async function readOne(sql, communityId) {
  const result = await sql`SELECT * FROM communities WHERE id = ${communityId}`;
  return result.length > 0 ? result[0] : null;
}

export async function create(sql, name, description) {
  const result = await sql`
    INSERT INTO communities (name, description)
    VALUES (${name}, ${description})
    RETURNING *
  `;
  return result[0];
}

export async function remove(sql, communityId) {
  const result = await sql`
    DELETE FROM communities WHERE id = ${communityId}
    RETURNING *
  `;
  return result.length > 0 ? result[0] : null;
}
