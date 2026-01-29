import postgres from "postgres";

const sql = postgres();

const addVoteCounts = async (comment) => {
  if (!comment) return null;
  const upvotes = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${comment.id} AND vote = 'upvote'`;
  const downvotes = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${comment.id} AND vote = 'downvote'`;
  return {
    ...comment,
    upvotes: upvotes[0]?.count || 0,
    downvotes: downvotes[0]?.count || 0,
  };
};

const addVoteCountsToList = async (comments) => {
  return Promise.all(comments.map(comment => addVoteCounts(comment)));
};

export const readAll = async (postId) => {
  const comments = await sql`SELECT * FROM posts WHERE parent_post_id = ${postId} ORDER BY created_at DESC`;
  return addVoteCountsToList(comments);
};

export const create = async (communityId, parentPostId, content, createdBy) => {
  const comments = await sql`
    INSERT INTO posts (community_id, parent_post_id, content, created_by) 
    VALUES (${communityId}, ${parentPostId}, ${content}, ${createdBy}) 
    RETURNING *
  `;
  return addVoteCounts(comments[0]);
};

export const remove = async (commentId, userId) => {
  const comments = await sql`
    DELETE FROM posts 
    WHERE id = ${commentId} AND created_by = ${userId}
    RETURNING *
  `;
  return comments.length > 0 ? addVoteCounts(comments[0]) : null;
};
