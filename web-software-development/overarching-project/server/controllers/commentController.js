import * as commentRepository from "../repositories/commentRepository.js";

export const getAll = async (c) => {
  try {
    const postId = parseInt(c.req.param("postId"), 10);
    const comments = await commentRepository.readAll(postId);
    return c.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return c.json({ error: "Failed to fetch comments" }, 500);
  }
};

export const create = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const postId = parseInt(c.req.param("postId"), 10);
    const body = await c.req.json();

    if (!body.content) {
      return c.json({ error: "Content is required" }, 400);
    }

    const user = c.get("user");
    const comment = await commentRepository.create(
      communityId,
      postId,
      body.content,
      user?.id
    );
    return c.json(comment, 200);
  } catch (error) {
    console.error("Error creating comment:", error);
    return c.json({ error: "Failed to create comment" }, 500);
  }
};

export const remove = async (c) => {
  try {
    const commentId = parseInt(c.req.param("commentId"), 10);
    const user = c.get("user");
    const comment = await commentRepository.remove(commentId, user?.id);
    if (!comment) {
      return c.json({ error: "Comment not found" }, 404);
    }
    return c.json(comment);
  } catch (error) {
    console.error("Error deleting comment:", error);
    return c.json({ error: "Failed to delete comment" }, 500);
  }
};
