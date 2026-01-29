<script>
  import { getPosts, removePost, upvotePost, downvotePost } from "$lib/states/postState.svelte.js";
  import { useAuthState } from '$lib/states/authState.svelte.js';

  let { communityId } = $props();

  let posts = $derived(getPosts(communityId));

  const auth = useAuthState();

  const handleDelete = async (postId) => {
    try {
      await removePost(communityId, postId);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(communityId, postId);
    } catch (error) {
      console.error("Failed to upvote post:", error);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await downvotePost(communityId, postId);
    } catch (error) {
      console.error("Failed to downvote post:", error);
    }
  };
</script>

<h2 class="text-2xl font-bold text-gray-800 mb-6">Posts</h2>

<ul>
  <li> 
    Post created by user 1
  </li>
</ul>

<ul class="space-y-6 list-none">
  {#each posts as post (post.id)}
    <li class="bg-white rounded-lg shadow-md hover:shadow-lg border border-gray-200 p-6 transition">
      <h3 class="text-xl font-semibold mb-2">
        <a href={`/communities/${communityId}/posts/${post.id}`} class="text-primary-600 hover:text-primary-800 hover:underline">
          {post.title}
        </a>
      </h3>
      <p class="text-gray-700 mb-4">{post.content}</p>
      
      <div class="flex flex-wrap gap-3 mb-4 text-sm">
        <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
          👍 {post.upvotes ?? 0} Upvotes
        </span>
        <span class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
          👎 {post.downvotes ?? 0} Downvotes
        </span>
      </div>
      
      <div class="flex flex-wrap gap-2 mt-4">
        {#if auth.user}
          <button 
            onclick={() => handleUpvote(post.id)}
            class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Upvote
          </button>
          <button 
            onclick={() => handleDownvote(post.id)}
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Downvote
          </button>
        {/if}
        {#if auth.user && post.created_by === auth.user.id}
          <button 
            onclick={() => handleDelete(post.id)}
            class="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Remove
          </button>
        {/if}
      </div>
    </li>
  {/each}
</ul>
