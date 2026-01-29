<script>
  import { getPost, initializePost } from "$lib/states/postState.svelte.js";
  import { browser } from '$app/environment';

  let { communityId, postId } = $props();

  // @ts-ignore
  let post = $derived(getPost(communityId, parseInt(postId)));

  $effect(async () => {
    if (browser && communityId && postId) {
      try {
        await initializePost(parseInt(communityId), parseInt(postId));
      } catch (error) {
        console.error("Failed to load post:", error);
      }
    }
  });
</script>

<h1 class="text-4xl font-bold text-gray-800 mb-4">{post ? post.title : "Loading..."}</h1>

{#if post}
  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6">
    <p class="text-gray-700 text-lg leading-relaxed">{post.content}</p>
    <p class="text-sm text-gray-500 mt-4">Post created by user {post.created_by}</p>
  </div>
{:else}
  <p class="text-gray-500 italic">Loading...</p>
{/if}
