<script>

  import { authFetch } from "$lib/utils/fetchUtils.js";
  import { PUBLIC_API_URL } from "$env/static/public";

  let message = $state(null);

  const fetchData = async () => {
    try {
      const response = await authFetch(`${PUBLIC_API_URL}/api/secret`);
      const data = await response.json();
      message = data.message;
    } catch (error) {
      message = error.message;
    }
  };

  import { useAuthState } from "$lib/states/authState.svelte.js";
    import Book from "$lib/components/books/Book.svelte";
    import BookForm from "$lib/components/books/BookForm.svelte";
  
  let todos = $state([]);
  const authState = useAuthState();

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${PUBLIC_API_URL}/api/todos`);
      const data = await response.json();
      todos = data;
    } catch (e) {
      console.error('Failed to fetch todos:', e);
    }
  };

  // $effect(() => {
  //   fetchTodos();
  // });
</script>

<!-- {#if authState.user}
  <h1>Welcome, {authState.user.email}!</h1>
  <button onclick={fetchData}>Fetch Protected Data</button>
  {#if message}
    <p>{message}</p>
  {/if}

  <a href="/todos">Go to your Todos</a>
{:else}
  <h1>Hello anonymous!</h1>
{/if}

<h2>Todos</h2>

<ul>
  {#each todos as todo}
    <li>{todo.name}</li>
  {/each}
</ul> -->



<BookForm />