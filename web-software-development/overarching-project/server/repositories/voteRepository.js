import postgres from "postgres";

const sql = postgres();

export const createOrUpdateVote = async (userId, postId, voteType) => {
  await sql`DELETE FROM votes WHERE user_id = ${userId} AND post_id = ${postId}`;
  
  const result = await sql`
    INSERT INTO votes (user_id, post_id, vote)
    VALUES (${userId}, ${postId}, ${voteType})
    RETURNING *
  `;
  return result[0];
};

export const countUpvotes = async (postId) => {
  const result = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${postId} AND vote = 'upvote'`;
  return result[0]?.count || 0;
};

export const countDownvotes = async (postId) => {
  const result = await sql`SELECT COUNT(*) as count FROM votes WHERE post_id = ${postId} AND vote = 'downvote'`;
  return result[0]?.count || 0;
};
