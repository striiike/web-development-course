<script>
  import Community from "$lib/components/communities/Community.svelte";
  import PostList from "$lib/components/posts/PostList.svelte";
  import PostForm from "$lib/components/posts/PostForm.svelte";
  import { initializePosts } from "$lib/states/postState.svelte.js";
  import { browser } from '$app/environment';

  let { data } = $props();

  // Initialize posts when the component mounts
  $effect(async () => {
    if (browser && data.communityId) {
      try {
        await initializePosts(data.communityId);
      } catch (error) {
        console.error("Failed to initialize posts:", error);
      }
    }
  });
</script>

<div class="max-w-6xl mx-auto px-4 py-8">
  <Community communityId={data.communityId} />
  
  <div class="mt-8">
    <PostForm communityId={data.communityId} />
    <PostList communityId={data.communityId} />
  </div>
</div>
