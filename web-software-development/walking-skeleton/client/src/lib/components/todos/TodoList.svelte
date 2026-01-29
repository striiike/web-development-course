<script>
  import { todos, removeTodo } from "$lib/states/todoState.svelte.js";
</script>

<h1>Todos</h1>

<ul>
  {#each todos as todo}
    <li>
      <a href={`/todos/${todo.id}`}>{todo.name}</a>
      <button onclick={() => removeTodo(todo.id)}>Remove</button>
    </li>
  {/each}
</ul>
