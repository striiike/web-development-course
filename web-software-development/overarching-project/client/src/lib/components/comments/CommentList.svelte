<script>
  import { getComments, removeComment, upvoteComment, downvoteComment } from "$lib/states/commentState.svelte.js";
  import { useAuthState } from '$lib/states/authState.svelte.js';

  let { communityId, postId } = $props();

  let commentList = $derived(getComments(postId));

  const auth = useAuthState();

  const handleDelete = async (commentId) => {
    try {
      await removeComment(communityId, postId, commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      await upvoteComment(communityId, postId, commentId);
    } catch (error) {
      console.error("Failed to upvote comment:", error);
    }
  };

  const handleDownvote = async (commentId) => {
    try {
      await downvoteComment(communityId, postId, commentId);
    } catch (error) {
      console.error("Failed to downvote comment:", error);
    }
  };
</script>

<h3 class="text-xl font-bold text-gray-800 mb-4">Comments</h3>

{#if commentList.length === 0}
  <p class="text-gray-500 italic">No comments yet.</p>
{:else}
  <ul class="space-y-4 list-none">
    {#each commentList as comment (comment.id)}
      <li class="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <p class="text-gray-700 mb-3">{comment.content}</p>
        
        <div class="flex flex-wrap gap-2 mb-3 text-sm">
          <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
            👍 {comment.upvotes ?? 0} Upvotes
          </span>
          <span class="inline-block bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
            👎 {comment.downvotes ?? 0} Downvotes
          </span>
        </div>
        
        <div class="flex flex-wrap gap-2">
          {#if auth.user}
            <button 
              onclick={() => handleUpvote(comment.id)}
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded transition text-sm"
            >
              Upvote
            </button>
            <button 
              onclick={() => handleDownvote(comment.id)}
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded transition text-sm"
            >
              Downvote
            </button>
          {/if}
          {#if auth.user && comment.created_by === auth.user.id}
            <button 
              onclick={() => handleDelete(comment.id)}
              class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded transition text-sm"
            >
              Remove
            </button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
{/if}
