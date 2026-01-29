import postgres from "postgres";

const sql = postgres();

const addVoteCounts = async (post) => {
  if (!post) return null;
  const upvotes = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${post.id} AND vote = 'upvote'`;
  const downvotes = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${post.id} AND vote = 'downvote'`;
  return {
    ...post,
    upvotes: upvotes[0]?.count || 0,
    downvotes: downvotes[0]?.count || 0,
  };
};

const addVoteCountsToList = async (posts) => {
  return Promise.all(posts.map(post => addVoteCounts(post)));
};

export const readAll = async (communityId) => {
  // Return only top-level posts (exclude comments which are rows with parent_post_id set)
  const posts = await sql`SELECT * FROM posts WHERE community_id = ${communityId} AND parent_post_id IS NULL ORDER BY created_at DESC`;
  return addVoteCountsToList(posts);
};

export const readOne = async (communityId, postId) => {
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId} AND community_id = ${communityId}`;
  return posts.length > 0 ? addVoteCounts(posts[0]) : null;
};

export const readById = async (postId) => {
  const posts = await sql`SELECT * FROM posts WHERE id = ${postId}`;
  return posts.length > 0 ? addVoteCounts(posts[0]) : null;
};

export const create = async (communityId, title, content, createdBy) => {
  const posts = await sql`
    INSERT INTO posts (community_id, title, content, created_by) 
    VALUES (${communityId}, ${title}, ${content}, ${createdBy}) 
    RETURNING *
  `;
  const post = posts[0];
  return addVoteCounts(post);
};

export const remove = async (communityId, postId, userId) => {
  const posts = await sql`
    DELETE FROM posts 
    WHERE id = ${postId} AND community_id = ${communityId} AND created_by = ${userId}
    RETURNING *
  `;
  return posts.length > 0 ? addVoteCounts(posts[0]) : null;
};

export const getHomepagePosts = async () => {
  // Get all top-level posts from the last 3 days, sorted by newest first
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const posts = await sql`
    SELECT * FROM posts 
    WHERE parent_post_id IS NULL AND created_at >= ${threeDaysAgo}
    ORDER BY created_at DESC
  `;
  
  // Add vote counts and comment counts to each post
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const votedPost = await addVoteCounts(post);
      const comments = await sql`SELECT COUNT(*) as count FROM posts WHERE parent_post_id = ${post.id}`;
      return {
        ...votedPost,
        comments: parseInt(comments[0]?.count, 10) || 0,
      };
    })
  );
  
  return postsWithCounts;
};
