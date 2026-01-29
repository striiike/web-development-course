import * as postRepository from "../repositories/postRepository.js";

export const getAll = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const posts = await postRepository.readAll(communityId);
    return c.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
};

export const getOne = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const postId = parseInt(c.req.param("postId"), 10);
    const post = await postRepository.readOne(communityId, postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return c.json({ error: "Failed to fetch post" }, 500);
  }
};

export const create = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const body = await c.req.json();

    if (!body.content) {
      return c.json({ error: "Content is required" }, 400);
    }

    const user = c.get("user");

    const post = await postRepository.create(
      communityId,
      body.title || null,
      body.content,
      user?.id
    );
    return c.json(post, 200);
  } catch (error) {
    console.error("Error creating post:", error);
    return c.json({ error: "Failed to create post" }, 500);
  }
};

export const remove = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const postId = parseInt(c.req.param("postId"), 10);
    const user = c.get("user");
    const post = await postRepository.remove(communityId, postId, user?.id);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    return c.json({ error: "Failed to delete post" }, 500);
  }
};

export const getHomepage = async (c) => {
  try {
    const posts = await postRepository.getHomepagePosts();
    return c.json(posts);
  } catch (error) {
    console.error("Error fetching homepage posts:", error);
    return c.json({ error: "Failed to fetch homepage posts" }, 500);
  }
};
