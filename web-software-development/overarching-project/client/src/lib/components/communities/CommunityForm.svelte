<script>
  import { addCommunity } from "$lib/states/communityState.svelte.js";
  import { useAuthState } from '$lib/states/authState.svelte.js';

  let form = $state(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();

    if (!name || !description) return;

    try {
      await addCommunity(name, description);
      form.reset();
    } catch (error) {
      console.error("Failed to add community:", error);
    }
  };
  const auth = useAuthState();
</script>

{#if auth.user}
  <form bind:this={form} onsubmit={handleSubmit} class="space-y-4">
    <div>
      <input 
        type="text" 
        name="name" 
        placeholder="Community name" 
        required 
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      />
    </div>
    <div>
      <textarea 
        name="description" 
        placeholder="Community description" 
        required
        rows="4"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
      ></textarea>
    </div>
    <button 
      type="submit"
      class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition"
    >
      Add community
    </button>
  </form>
{:else}
  <p class="text-gray-600">Please <a href="/auth/login" class="text-primary-600 hover:text-primary-800 hover:underline font-semibold">log in</a> to add communities.</p>
{/if}

<style>
  :global(.primary-600) {
    color: #0052a3;
    background-color: #0052a3;
  }

  :global(.primary-700) {
    background-color: #003d7a;
  }

  :global(.primary-800) {
    color: #003d7a;
  }
</style>
