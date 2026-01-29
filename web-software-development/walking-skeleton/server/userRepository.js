import postgres from "postgres";

const sql = postgres();

const getAllUsers = async () => {
  return await sql`
    SELECT
      users.id,
      users.email,
      users.created_at,
      array_agg(user_roles.role) FILTER (WHERE user_roles.role IS NOT NULL) as roles
    FROM users
    LEFT JOIN user_roles ON users.id = user_roles.user_id
    GROUP BY users.id, users.email, users.created_at
    ORDER BY users.created_at DESC
  `;
};

const getSystemStats = async () => {
  const taskCountResult = await sql`SELECT COUNT(*) FROM todo_tasks`;
  const todoCountResult = await sql`SELECT COUNT(*) FROM todos`;

  return {
    tasks: parseInt(taskCountResult[0].count, 10),
    todos: parseInt(todoCountResult[0].count, 10),
  };
}

export { getAllUsers, getSystemStats };