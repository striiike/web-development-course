<script>
  import Post from "$lib/components/posts/Post.svelte";
  import CommentForm from "$lib/components/comments/CommentForm.svelte";
  import CommentList from "$lib/components/comments/CommentList.svelte";
  import { initializeComments } from "$lib/states/commentState.svelte.js";
  import { browser } from '$app/environment';

  let { data } = $props();

  // Initialize comments when the page loads
  $effect(async () => {
    if (browser && data.communityId && data.postId) {
      try {
        await initializeComments(data.communityId, data.postId);
      } catch (error) {
        console.error("Failed to initialize comments:", error);
      }
    }
  });
</script>

<div class="max-w-4xl mx-auto px-4 py-8">
  <Post communityId={data.communityId} postId={data.postId} />

  <div class="mt-8">
    <CommentForm communityId={data.communityId} postId={data.postId} />
    <CommentList communityId={data.communityId} postId={data.postId} />
  </div>
</div>
