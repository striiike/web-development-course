<script>
  const DARK_MODE = "dark";
  const LIGHT_MODE = "light";

  import { browser } from "$app/environment";

  let currentMode = $state(LIGHT_MODE);

  if (browser) {
    currentMode = localStorage.getItem("mode") || LIGHT_MODE;
    document.documentElement.setAttribute("data-mode", currentMode);
  }

  const toggleDarkMode = () => {
    currentMode = currentMode === LIGHT_MODE ? DARK_MODE : LIGHT_MODE;
    localStorage.setItem("mode", currentMode);
    document.documentElement.setAttribute("data-mode", currentMode);
  };
</script>

<button
  class="btn btn-sm preset-ghost"
  onclick={toggleDarkMode}
  aria-label={currentMode === DARK_MODE
    ? "Switch to light mode"
    : "Switch to dark mode"}
>
  {#if currentMode === DARK_MODE}
    ☀️
  {:else}
    🌙
  {/if}
</button>