export function load({ params }) {
  return {
    communityId: parseInt(params.communityId),
    postId: parseInt(params.postId)
  };
}
