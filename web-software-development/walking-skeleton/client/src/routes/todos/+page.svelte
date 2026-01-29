<script>
  import TodoList from "$lib/components/todos/TodoList.svelte";
  import TodoForm from "$lib/components/todos/TodoForm.svelte";
  import { initializeTodos } from '$lib/states/todoState.svelte.js';
  import { browser } from '$app/environment';

  $effect(async () => {
    if (browser) {
      try {
        await initializeTodos();
      } catch (error) {
        console.error("Failed to initialize todos:", error);
      }
    }
  });
</script>

<TodoForm />
<TodoList />
