import * as api from "$lib/apis/commentsApi.js";

let comments = $state({});
let initializedPosts = $state(new Set());

export function getComments(postId) {
  return comments[postId] || [];
}

export async function initializeComments(communityId, postId) {
  const key = `${communityId}-${postId}`;
  if (initializedPosts.has(key)) return;
  try {
    const data = await api.readAll(communityId, postId);
    comments[postId] = data;
    initializedPosts.add(key);
  } catch (error) {
    console.error("Failed to initialize comments:", error);
  }
}

export async function addComment(communityId, postId, content) {
  try {
    const comment = await api.create(communityId, postId, { content });
    if (!comments[postId]) {
      comments[postId] = [];
    }
    comments[postId].push(comment);
    return comment;
  } catch (error) {
    console.error("Failed to add comment:", error);
    throw error;
  }
}

export async function removeComment(communityId, postId, commentId) {
  try {
    await api.remove(communityId, postId, commentId);
    if (comments[postId]) {
      comments[postId] = comments[postId].filter((c) => c.id !== commentId);
    }
  } catch (error) {
    console.error("Failed to remove comment:", error);
    throw error;
  }
}

export async function upvoteComment(communityId, postId, commentId) {
  try {
    const updatedComment = await api.upvote(communityId, postId, commentId);
    if (comments[postId]) {
      const index = comments[postId].findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments[postId][index] = updatedComment;
      }
    }
    return updatedComment;
  } catch (error) {
    console.error("Failed to upvote comment:", error);
    throw error;
  }
}

export async function downvoteComment(communityId, postId, commentId) {
  try {
    const updatedComment = await api.downvote(communityId, postId, commentId);
    if (comments[postId]) {
      const index = comments[postId].findIndex((c) => c.id === commentId);
      if (index !== -1) {
        comments[postId][index] = updatedComment;
      }
    }
    return updatedComment;
  } catch (error) {
    console.error("Failed to downvote comment:", error);
    throw error;
  }
}
