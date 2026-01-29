<script>
  import { getCommunities, removeCommunity } from "$lib/states/communityState.svelte.js";
  import { useAuthState } from '$lib/states/authState.svelte.js';

  let communities = $derived(getCommunities());

  const auth = useAuthState();

  const handleDelete = async (communityId) => {
    try {
      await removeCommunity(communityId);
    } catch (error) {
      console.error("Failed to delete community:", error);
    }
  };
</script>

<div class="space-y-4">
  {#each communities as community (community.id)}
    <div class="card bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 p-6">
      <h2 class="text-2xl font-semibold mb-2">
        <a href={`/communities/${community.id}`} class="text-primary-600 hover:text-primary-800 hover:underline transition">
          {community.name}
        </a>
      </h2>
      <p class="text-gray-700 mb-4">{community.description}</p>
      {#if auth.user && community.created_by === auth.user.id}
        <button 
          onclick={() => handleDelete(community.id)}
          class="btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 transition"
        >
          Remove
        </button>
      {/if}
    </div>
  {/each}
</div>

<style>
  :global(.card) {
    transition: all 0.2s ease;
  }

  :global(.btn) {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
  }

  :global(.btn:hover) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  :global(.primary-600) {
    color: #0052a3;
  }

  :global(.primary-800) {
    color: #003d7a;
  }
</style>
