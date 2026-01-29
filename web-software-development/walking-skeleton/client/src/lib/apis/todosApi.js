import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from "$lib/utils/fetchUtils.js";

const BASE = PUBLIC_API_URL || "";

const url = (path) => `${BASE}${path}`;

export async function readAll() {
  const res = await authFetch(url(`/api/todos`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function readOne(id) {
  const res = await authFetch(url(`/api/todos/${id}`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(todo) {
  const res = await authFetch(url(`/api/todos`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function update(id, todo) {
  const res = await authFetch(url(`/api/todos/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(id) {
  const res = await authFetch(url(`/api/todos/${id}`), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}
