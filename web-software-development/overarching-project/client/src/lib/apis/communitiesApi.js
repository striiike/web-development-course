import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from '$lib/utils/fetchUtils.js';

const BASE = PUBLIC_API_URL || "";

const url = (path) => `${BASE}${path}`;

export async function readAll() {
  const res = await fetch(url('/api/communities'));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function readOne(communityId) {
  const res = await fetch(url(`/api/communities/${communityId}`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(community) {
  const res = await authFetch(url('/api/communities'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(community)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(communityId) {
  const res = await authFetch(url(`/api/communities/${communityId}`), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}
