import * as tasksApi from "$lib/apis/tasksApi.js";

// Tasks are stored on server via API. The `tasks` shared state mirrors server data
// for each todo: tasks[todoId] = [ ... ]
export let tasks = $state({});

export function getTasks(todoId) {
  return tasks[todoId] || [];
}

export function setTasksForTodo(todoId, list) {
  tasks[todoId] = list || [];
}

export async function initTasks(todoId) {
  try {
    const list = await tasksApi.readAll(todoId);
    tasks[todoId] = list;
    return list;
  } catch (err) {
    console.error('Failed to init tasks from API', err);
    tasks[todoId] = [];
    return [];
  }
}

export async function addTask(todoId, task) {
  // task is { description, is_done }
  try {
    const created = await tasksApi.create(todoId, task);
    if (!tasks[todoId]) tasks[todoId] = [];
    console.log('✅ addTask: received created task from API:', created);
    tasks[todoId].push(created);
    console.log('✅ addTask: tasks after push:', tasks[todoId]);
    return created;
  } catch (err) {
    console.error('❌ Failed to add task via API', err);
    throw err;
  }
}

export async function removeTask(todoId, taskId) {
  try {
    const deleted = await tasksApi.remove(todoId, taskId);
    if (tasks[todoId]) {
      tasks[todoId] = tasks[todoId].filter(task => task.id !== taskId);
    }
    return deleted;
  } catch (err) {
    console.error('Failed to remove task via API', err);
    throw err;
  }
}

export async function toggleTask(todoId, taskId) {
  if (!tasks[todoId]) return;
  const existing = tasks[todoId].find((t) => t.id === taskId);
  if (!existing) return;
  try {
    const updated = await tasksApi.update(todoId, taskId, { description: existing.description, is_done: !existing.is_done });
    tasks[todoId] = tasks[todoId].map((t) => (t.id === taskId ? updated : t));
    return updated;
  } catch (err) {
    console.error('Failed to toggle task via API', err);
    throw err;
  }
}

export async function getTaskById(todoId, taskId) {
  const found = tasks[todoId]?.find((t) => t.id === taskId);
  if (found) return found;
  try {
    const one = await tasksApi.readOne(todoId, taskId);
    if (!tasks[todoId]) tasks[todoId] = [];
    tasks[todoId].push(one);
    return one;
  } catch (err) {
    console.error('Failed to fetch task by id', err);
    throw err;
  }
}
