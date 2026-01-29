import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from '$lib/utils/fetchUtils.js';

const BASE = PUBLIC_API_URL || '';
const url = (path) => `${BASE}${path}`;

export async function readAll() {
  const res = await fetch(url(`/api/books`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function readOne(bookId) {
  const res = await fetch(url(`/api/books/${bookId}`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(book) {
  const res = await authFetch(url(`/api/books`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(bookId) {
  const res = await authFetch(url(`/api/books/${bookId}`), {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export default { readAll, readOne, create, remove };
