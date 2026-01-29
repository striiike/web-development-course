<script>
  import { useUserState } from "../../states/userState.svelte.js";

  let user = useUserState();
  let stats = $state("");

  const listenStats = () => {
    if (!import.meta.env.SSR && user.email) {
      const eventSource = new EventSource("/api/stats/sse-active-users");

      eventSource.onmessage = (event) => {
        stats = event.data;
      };
    }
  };
</script>

{#if user.loading}
  <p>Loading user session...</p>
{:else if user.email}
  {listenStats()}
  <div>
    <p>{user.email}</p>
    <p>{stats}</p>
  </div>
{:else}
  <a href="/auth/login">Login</a>
{/if}
