<script>
  import { browser } from "$app/environment";

  const themes = ["cerberus", "wintry"];
  let currentTheme = $state("cerberus");

  if (browser) {
    currentTheme = localStorage.getItem("theme") || "cerberus";
    document.documentElement.setAttribute("data-theme", currentTheme);
  }

  const setTheme = (theme) => {
    currentTheme = theme;
    if (browser) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  };
</script>

<select
  class="select select-sm"
  value={currentTheme}
  onchange={(e) => setTheme(e.target.value)}
>
  {#each themes as theme}
    <option value={theme}>
      Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}
    </option>
  {/each}
</select>