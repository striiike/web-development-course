<script>
  import { getOne, initializeCommunity } from "$lib/states/communityState.svelte.js";
  import { browser } from '$app/environment';

  let { communityId } = $props();

  // @ts-ignore
  let community = $derived(getOne(parseInt(communityId)));

  $effect(async () => {
    if (browser && communityId) {
      try {
        await initializeCommunity(parseInt(communityId));
      } catch (error) {
        console.error("Failed to load community:", error);
      }
    }
  });
</script>

<h1 class="text-4xl font-bold text-gray-800 mb-4">{community ? community.name : "Loading..."}</h1>

{#if community}
  <div class="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
    <p class="text-gray-700 text-lg">{community.description}</p>
    <p class="text-sm text-gray-500 mt-4">Created by user {community.created_by}</p>
  </div>
{:else}
  <p class="text-gray-500 italic">Loading...</p>
{/if}
