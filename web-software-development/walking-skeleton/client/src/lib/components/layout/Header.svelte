<script>
  import DarkModeToggle from "../themes/DarkModeToggle.svelte";
  import ThemeSwitcher from "../themes/ThemeSwitcher.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  const authState = useAuthState();
</script>

<header class="flex items-center bg-primary-100 p-4 mb-6">
  <span class="text-lg text-primary-900">
    Booksy
    {#if authState.user}
      ({authState.user.email})
    {/if}
  </span>
  <nav class="ml-4">
    <ul class="flex space-x-4">
      {#if authState.user}
        <li>
          <button class="anchor" onclick={() => authState.logout()}>
            Logout
          </button>
        </li>
      {:else}
        <li><a class="anchor" href="/auth/login">Login</a></li>
        <li><a class="anchor" href="/auth/register">Register</a></li>
      {/if}
    </ul>
  </nav>
  <div class="flex ml-auto">
    <ThemeSwitcher />
    <DarkModeToggle />
  </div>
</header>