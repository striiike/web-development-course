import * as api from "$lib/apis/postsApi.js";

let posts = $state([]);
let initialized = $state(false);

export function getPosts() {
  return posts;
}

export async function initializeHomePage(force = false) {
  if (initialized && !force) return;
  try {
    const data = await api.getHomepage();
    posts = data;
    initialized = true;
  } catch (error) {
    console.error("Failed to initialize home page posts:", error);
  }
}

export async function refreshHomePage() {
  initialized = false;
  await initializeHomePage(true);
}
