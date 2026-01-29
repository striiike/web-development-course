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

<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div class="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-md">
    <h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      {data.action === "login" ? "Login" : "Register"}
    </h2>

    {#if message}
      <div class="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-4">
        <p>{message}</p>
      </div>
    {/if}

    {#if errorMessage}
      <div class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p>{errorMessage}</p>
      </div>
    {/if}

    <form onsubmit={handleForm} class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        class="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        {isLoading
          ? "Please wait..."
          : data.action === "login"
            ? "Login"
            : "Register"}
      </button>
    </form>

    <div class="mt-6 pt-6 border-t border-gray-200">
      {#if data.action === "login"}
        <p class="text-center text-gray-600">
          Don't have an account? <a href="/auth/register" class="text-primary-600 hover:text-primary-800 hover:underline font-semibold">Register here</a>
        </p>
      {:else}
        <p class="text-center text-gray-600">
          Already have an account? <a href="/auth/login" class="text-primary-600 hover:text-primary-800 hover:underline font-semibold">Login here</a>
        </p>
      {/if}
    </div>
  </div>
</div>