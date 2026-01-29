import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { useAuthState } from '$lib/states/authState.svelte.js';

export async function authFetch(input, init = {}) {
  const auth = useAuthState();
  const token = auth.token;

  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json');

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    try {
      auth.logout();
      if (browser) goto('/auth/login');
    } catch (e) {
      console.error('authFetch logout redirect error', e);
    }
  }

  return res;
}
