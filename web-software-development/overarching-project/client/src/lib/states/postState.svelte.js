import * as api from "$lib/apis/postsApi.js";

let posts = $state({});
let initializedCommunities = $state(new Set());

export function getPosts(communityId) {
  return posts[communityId] || [];
}

export function getPost(communityId, postId) {
  return getPosts(communityId).find((p) => p.id === postId);
}

export async function initializePosts(communityId) {
  if (initializedCommunities.has(communityId)) return;
  try {
    const data = await api.readAll(communityId);
    posts[communityId] = data;
    initializedCommunities.add(communityId);
  } catch (error) {
    console.error("Failed to initialize posts:", error);
  }
}

export async function initializePost(communityId, postId) {
  try {
    const post = await api.readOne(communityId, postId);
    if (!posts[communityId]) {
      posts[communityId] = [];
    }
    const existing = posts[communityId].find((p) => p.id === post.id);
    if (!existing) {
      posts[communityId].push(post);
    }
    return post;
  } catch (error) {
    console.error("Failed to initialize post:", error);
  }
}

export async function addPost(communityId, title, content) {
  try {
    const post = await api.create(communityId, { title, content });
    if (!posts[communityId]) {
      posts[communityId] = [];
    }
    posts[communityId].push(post);
    return post;
  } catch (error) {
    console.error("Failed to add post:", error);
    throw error;
  }
}

export async function removePost(communityId, postId) {
  try {
    await api.remove(communityId, postId);
    if (posts[communityId]) {
      posts[communityId] = posts[communityId].filter((p) => p.id !== postId);
    }
  } catch (error) {
    console.error("Failed to remove post:", error);
    throw error;
  }
}

export async function upvotePost(communityId, postId) {
  try {
    const updatedPost = await api.upvote(communityId, postId);
    if (posts[communityId]) {
      const index = posts[communityId].findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts[communityId][index] = updatedPost;
      }
    }
    return updatedPost;
  } catch (error) {
    console.error("Failed to upvote post:", error);
    throw error;
  }
}

export async function downvotePost(communityId, postId) {
  try {
    const updatedPost = await api.downvote(communityId, postId);
    if (posts[communityId]) {
      const index = posts[communityId].findIndex((p) => p.id === postId);
      if (index !== -1) {
        posts[communityId][index] = updatedPost;
      }
    }
    return updatedPost;
  } catch (error) {
    console.error("Failed to downvote post:", error);
    throw error;
  }
}
