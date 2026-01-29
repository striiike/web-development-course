<script>
  import { useUserState } from "../../states/userState.svelte.js";
  const userState = useUserState();
</script>

{#if userState.loading}
  <p>Loading...</p>
{:else if userState.email}
  <p>{userState.email}</p>
{:else}
  <a href="/login">Login</a> or <a href="/register">Register</a>
{/if}