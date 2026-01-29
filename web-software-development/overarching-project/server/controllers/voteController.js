import * as postRepository from "../repositories/postRepository.js";
import * as voteRepository from "../repositories/voteRepository.js";

export const upvotePost = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const postId = parseInt(c.req.param("postId"), 10);
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await voteRepository.createOrUpdateVote(user.id, postId, "upvote");

    const post = await postRepository.readOne(communityId, postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const upvotes = await voteRepository.countUpvotes(postId);
    const downvotes = await voteRepository.countDownvotes(postId);

    return c.json({
      ...post,
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("Error upvoting post:", error);
    return c.json({ error: "Failed to upvote post" }, 500);
  }
};

export const downvotePost = async (c) => {
  try {
    const communityId = parseInt(c.req.param("communityId"), 10);
    const postId = parseInt(c.req.param("postId"), 10);
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await voteRepository.createOrUpdateVote(user.id, postId, "downvote");

    const post = await postRepository.readOne(communityId, postId);
    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    const upvotes = await voteRepository.countUpvotes(postId);
    const downvotes = await voteRepository.countDownvotes(postId);

    return c.json({
      ...post,
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("Error downvoting post:", error);
    return c.json({ error: "Failed to downvote post" }, 500);
  }
};

export const upvoteComment = async (c) => {
  try {
    const postId = parseInt(c.req.param("postId"), 10);
    const commentId = parseInt(c.req.param("commentId"), 10);
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await voteRepository.createOrUpdateVote(user.id, commentId, "upvote");

    const comment = await postRepository.readById(commentId);
    if (!comment) {
      return c.json({ error: "Comment not found" }, 404);
    }

    const upvotes = await voteRepository.countUpvotes(commentId);
    const downvotes = await voteRepository.countDownvotes(commentId);

    return c.json({
      ...comment,
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("Error upvoting comment:", error);
    return c.json({ error: "Failed to upvote comment" }, 500);
  }
};

export const downvoteComment = async (c) => {
  try {
    const postId = parseInt(c.req.param("postId"), 10);
    const commentId = parseInt(c.req.param("commentId"), 10);
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await voteRepository.createOrUpdateVote(user.id, commentId, "downvote");

    const comment = await postRepository.readById(commentId);
    if (!comment) {
      return c.json({ error: "Comment not found" }, 404);
    }

    const upvotes = await voteRepository.countUpvotes(commentId);
    const downvotes = await voteRepository.countDownvotes(commentId);

    return c.json({
      ...comment,
      upvotes,
      downvotes,
    });
  } catch (error) {
    console.error("Error downvoting comment:", error);
    return c.json({ error: "Failed to downvote comment" }, 500);
  }
};
