import postgres from "postgres";

const sql = postgres();

const stats = async (c) => {
  const todosResult = await sql`SELECT COUNT(*)::int AS count FROM todos`;
  const tasksResult = await sql`SELECT COUNT(*)::int AS count FROM todo_tasks`;

  const todos = todosResult[0]?.count ?? 0;
  const tasks = tasksResult[0]?.count ?? 0;

  return c.json({ todos, tasks });
};

export { stats };
