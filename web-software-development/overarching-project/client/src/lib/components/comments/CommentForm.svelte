<script>
  import { addComment } from "$lib/states/commentState.svelte.js";
  import { useAuthState } from "$lib/states/authState.svelte.js";

  let { communityId, postId } = $props();
  const auth = useAuthState();
  let form = $state(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const content = formData.get("content")?.trim();

    if (!content) return;

    try {
      await addComment(communityId, postId, content);
      form.reset();
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
</script>

{#if auth.user}
  <form bind:this={form} onsubmit={handleSubmit} class="space-y-3 bg-gray-50 rounded-lg border border-gray-200 p-4 mb-6">
    <div>
      <textarea 
        name="content" 
        placeholder="Comment content" 
        required
        rows="3"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      ></textarea>
    </div>
    <button 
      type="submit"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      Add comment
    </button>
  </form>
{:else}
  <!-- Comment form visible only to logged-in users -->
{/if}
