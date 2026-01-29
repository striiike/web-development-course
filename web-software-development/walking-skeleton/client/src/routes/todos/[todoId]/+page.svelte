<script>
  import Todo from "$lib/components/todos/Todo.svelte";
  import { initializeTodo, initializeTasks } from "$lib/states/todoState.svelte.js";
  import { browser } from '$app/environment';

  let { data } = $props();

  $effect(async () => {
    if (browser && data.todoId) {
      try {
        await Promise.all([
          initializeTodo(data.todoId),
          initializeTasks(data.todoId)
        ]);
      } catch (error) {
        console.error("Failed to initialize todo:", error);
      }
    }
  });
</script>

<Todo todoId={data.todoId} />
