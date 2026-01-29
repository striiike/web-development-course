import { PUBLIC_API_URL } from '$env/static/public';
import { authFetch } from '$lib/utils/fetchUtils.js';

const BASE = PUBLIC_API_URL || "";

const url = (path) => `${BASE}${path}`;

export async function readAll(communityId, postId) {
  const res = await fetch(url(`/api/communities/${communityId}/posts/${postId}/comments`));
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function create(communityId, postId, comment) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/comments`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment)
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function remove(communityId, postId, commentId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/comments/${commentId}`), {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function upvote(communityId, postId, commentId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/comments/${commentId}/upvote`), {
    method: 'POST'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function downvote(communityId, postId, commentId) {
  const res = await authFetch(url(`/api/communities/${communityId}/posts/${postId}/comments/${commentId}/downvote`), {
    method: 'POST'
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}
