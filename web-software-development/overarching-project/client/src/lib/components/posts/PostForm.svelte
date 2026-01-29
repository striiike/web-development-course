<script>
  import { addPost } from "$lib/states/postState.svelte.js";
  import { useAuthState } from '$lib/states/authState.svelte.js';

  let { communityId } = $props();
  const auth = useAuthState();

  let form = $state(null);


  const handleSubmit = async (e) => {
    e.preventDefault();


    const formData = new FormData(form);
    const title = formData.get("title")?.trim();
    const content = formData.get("content")?.trim();

    if (!title || !content) return;

    try {
      await addPost(communityId, title, content);
      form.reset();
    } catch (error) {
      console.error("Failed to add post:", error);
    }
  };
</script>

{#if auth.user}
  <form bind:this={form} onsubmit={handleSubmit} class="space-y-4 bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
    <div>
      <input 
        type="text" 
        name="title" 
        placeholder="Post title" 
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      />
    </div>
    <div>
      <textarea 
        name="content" 
        placeholder="Post content" 
        required
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      ></textarea>
    </div>
    <button 
      type="submit"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      Add post
    </button>
  </form>
{:else}
  <!-- Post form visible only to logged-in users -->
{/if}
