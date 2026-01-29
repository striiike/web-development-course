import postgres from "postgres";

const sql = postgres();

export const findAll = async () => {
  return await sql`SELECT * FROM todos`;
};
