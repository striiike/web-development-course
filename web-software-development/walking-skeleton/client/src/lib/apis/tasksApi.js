import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from "$lib/utils/fetchUtils.js";

const BASE = PUBLIC_API_URL || "";

const url = (path) => `${BASE}${path}`;

export async function readAll(todoId) {
  const res = await authFetch(url(`/api/todos/${todoId}/tasks`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function readOne(todoId, taskId) {
  const res = await authFetch(url(`/api/todos/${todoId}/tasks/${taskId}`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(todoId, task) {
  const res = await authFetch(url(`/api/todos/${todoId}/tasks`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function update(todoId, taskId, task) {
  const res = await authFetch(url(`/api/todos/${todoId}/tasks/${taskId}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(todoId, taskId) {
  const res = await authFetch(url(`/api/todos/${todoId}/tasks/${taskId}`), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}
