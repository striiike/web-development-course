<script>
  import { getTodos } from "$lib/states/todoState.svelte.js";
  import TaskList from "$lib/components/todos/TaskList.svelte";
  import TaskForm from "$lib/components/todos/TaskForm.svelte";

  let { todoId } = $props();

  // @ts-ignore
  let todo = $derived(getTodos().find((t) => t.id === parseInt(todoId)));
</script>

<h1>{todo ? todo.name : "Loading..."}</h1>

<TaskList todoId={parseInt(todoId)} />
<TaskForm todoId={parseInt(todoId)} />
