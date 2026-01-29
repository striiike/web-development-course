<script>
  import { getPosts, refreshHomePage } from "$lib/states/homePageState.svelte.js";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import * as api from "$lib/apis/postsApi.js";

  let posts = $derived(getPosts());
  const auth = useAuthState();

  const handleUpvote = async (communityId, postId) => {
    try {
      await api.upvote(communityId, postId);
      // Refresh homepage posts to get updated vote counts
      await refreshHomePage();
    } catch (error) {
      console.error("Failed to upvote post:", error);
    }
  };

  const handleDownvote = async (communityId, postId) => {
    try {
      await api.downvote(communityId, postId);
      // Refresh homepage posts to get updated vote counts
      await refreshHomePage();
    } catch (error) {
      console.error("Failed to downvote post:", error);
    }
  };
</script>

<div class="space-y-6">
  <h2 class="text-3xl font-bold text-gray-800">Recent Posts</h2>

  {#if posts.length === 0}
    <p class="text-center text-gray-500 py-8">No posts yet.</p>
  {:else}
    <ul class="space-y-4 list-none">
      {#each posts as post (post.id)}
        <li class="card bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 p-6">
          <h3 class="text-xl font-semibold mb-2">
            <a href={`/communities/${post.community_id}/posts/${post.id}`} class="text-primary-600 hover:text-primary-800 hover:underline transition">
              {post.title}
            </a>
          </h3>
          <p class="text-gray-700 mb-3">{post.content}</p>
          <!-- <p class="text-sm text-gray-500 mb-4">Post created by user {post.created_by}</p> -->
          <div class="flex flex-wrap gap-3 mb-4 text-sm">
            <span class="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
              👍 {post.upvotes ?? 0} Upvotes
            </span>
            <span class="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
              👎 {post.downvotes ?? 0} Downvotes
            </span>
            <span class="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
              💬 {post.comments ?? 0} Comments
            </span>
          </div>
          {#if auth.user}
            <div class="flex flex-wrap gap-2">
              <button 
                onclick={() => handleUpvote(post.community_id, post.id)}
                class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Upvote
              </button>
              <button 
                onclick={() => handleDownvote(post.community_id, post.id)}
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Downvote
              </button>
            </div>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  :global(.card) {
    transition: all 0.2s ease;
  }

  :global(.badge) {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  :global(.badge-outline) {
    border: 1px solid #d1d5db;
    background-color: #f9fafb;
    color: #374151;
  }

  :global(.primary-600) {
    color: #0052a3;
  }

  :global(.primary-800) {
    color: #003d7a;
  }
</style>

