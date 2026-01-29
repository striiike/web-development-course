import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from '$lib/utils/fetchUtils.js';

const BASE = PUBLIC_API_URL || "";

const url = (path) => `${BASE}${path}`;

export async function readAll(communityId) {
  const res = await fetch(url(`/api/communities/${communityId}/posts`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function readOne(communityId, postId) {
  const res = await fetch(url(`/api/communities/${communityId}/posts/${postId}`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(communityId, post) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(communityId, postId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}`), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function upvote(communityId, postId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/upvote`), {
    method: 'POST'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function downvote(communityId, postId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/downvote`), {
    method: 'POST'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function getHomepage() {
  const res = await fetch(url(`/api/homepage`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}
