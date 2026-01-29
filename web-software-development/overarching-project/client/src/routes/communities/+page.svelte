<script>
  import CommunityList from "$lib/components/communities/CommunityList.svelte";
  import CommunityForm from "$lib/components/communities/CommunityForm.svelte";
  import { initializeCommunities } from "$lib/states/communityState.svelte.js";
  import { browser } from '$app/environment';

  // Initialize communities when the page loads
  $effect(() => {
    if (browser) {
      initializeCommunities();
    }
  }); 
</script>

<h1 class="text-4xl font-bold text-gray-800 mb-8">Communities</h1>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div class="lg:col-span-1">
    <div class="card bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Create Community</h2>
      <CommunityForm />
    </div>
  </div>
  <div class="lg:col-span-2">
    <CommunityList />
  </div>
</div>
