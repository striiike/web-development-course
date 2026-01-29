<script>
  import { goto } from "$app/navigation";
  import { useAuthState } from "$lib/states/authState.svelte.js";

  let { data } = $props();
  let message = $state("");
  let errorMessage = $state("");
  let isLoading = $state(false);

  const authState = useAuthState();

  const handleForm = async (e) => {
    e.preventDefault();
    errorMessage = "";
    message = "";
    isLoading = true;

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      if (data.action === "login") {
        await authState.login(email, password);
        message = "Login successful! Redirecting...";
        setTimeout(() => goto("/"), 1000);
      } else {
        await authState.register(email, password);
        message = "Registration successful! You can now log in.";
        setTimeout(() => goto("/auth/login"), 2000);
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="max-w-md mx-auto">
  <h2 class="text-2xl font-bold text-primary-900-100 mb-6">
    {data.action === "login" ? "Login" : "Register"}
  </h2>

  {#if message}
    <div class="card preset-filled-success p-4 mb-4">
      <p>{message}</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="card preset-filled-error p-4 mb-4">
      <p>{errorMessage}</p>
    </div>
  {/if}

  <form onsubmit={handleForm} class="space-y-4">
    <label for="email" class="label">
      <span class="label-text">Email</span>
      <input
        class="input"
        id="email"
        name="email"
        type="email"
        placeholder="user@example.com"
        required
      />
    </label>

    <label for="password" class="label">
      <span class="label-text">Password</span>
      <input
        class="input"
        id="password"
        name="password"
        type="password"
        placeholder="Enter your password"
        required
      />
    </label>

    <button
      class="w-full btn preset-filled-primary-500"
      type="submit"
      disabled={isLoading}
    >
      {isLoading
        ? "Please wait..."
        : data.action === "login"
          ? "Login"
          : "Register"}
    </button>
  </form>

  <p class="text-center mt-6 text-sm">
    {#if data.action === "login"}
      Don't have an account?
      <a class="anchor" href="/auth/register"> Register here </a>
    {:else}
      Already have an account?
      <a class="anchor" href="/auth/login"> Login here </a>
    {/if}
  </p>
</div>