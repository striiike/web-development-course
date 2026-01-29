<script>
  import UserReadingList from "$lib/components/books/UserReadingList.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";

  const authState = useAuthState();
</script>

{#if authState.user}
  <UserReadingList />
{:else}
  <p>Please <a href="/auth/login">log in</a> to view your reading list.</p>
{/if}