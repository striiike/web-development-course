import postgres from "postgres";

const sql = postgres();

const create = async (userId, todoId, task) => {
  const userTodoExists = await sql`
    SELECT id FROM todos
    WHERE id = ${todoId} AND user_id = ${userId}`;

  if (userTodoExists.length === 0) {
    return null;
  }

  const result = await sql`
    INSERT INTO todo_tasks (todo_id, description)
    VALUES (${todoId}, ${task.description})
    RETURNING *`;

  return result[0];
};

const deleteById = async (userId, id) => {
  const result = await sql`
    DELETE FROM todo_tasks
    WHERE id = ${id} AND todo_id IN (
      SELECT id FROM todos WHERE user_id = ${userId}
    )
    RETURNING *`;

  return result[0];
};

const findAll = async (userId, todoId) => {
  const userTodoExists = await sql`
    SELECT id FROM todos
    WHERE id = ${todoId} AND user_id = ${userId}`;

  if (userTodoExists.length === 0) {
    return null;
  }

  return await sql`
    SELECT * FROM todo_tasks
    WHERE todo_id = ${todoId}`;
};

const findById = async (userId, id) => {
  const result = await sql`
    SELECT * FROM todo_tasks
    WHERE id = ${id} AND todo_id IN (
      SELECT id FROM todos WHERE user_id = ${userId}
    )`;

  return result[0];
};

const updateById = async (userId, id, task) => {
  const result = await sql`
    UPDATE todo_tasks
    SET
      description = ${task.description},
      is_done = ${task.is_done}
    WHERE id = ${id} AND todo_id IN (
      SELECT id FROM todos WHERE user_id = ${userId}
    )
    RETURNING *`;

  return result[0];
};

export { create, deleteById, findAll, findById, updateById };
