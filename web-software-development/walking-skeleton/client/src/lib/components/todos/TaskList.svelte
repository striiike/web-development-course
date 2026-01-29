<script>
  import { tasks, removeTask, toggleTask } from "$lib/states/taskState.svelte.js";

  let { todoId } = $props();
</script>

<ul>
  {#each tasks[todoId] || [] as task}
    <li>
      {#if task.is_done}
        <s>{task.description}</s>
      {:else}
        <a href={`/todos/${todoId}/tasks/${task.id}`}>{task.description}</a>
      {/if}
      <button onclick={() => toggleTask(todoId, task.id)}>
        {task.is_done ? 'Mark not done' : 'Mark done'}
      </button>
      <button onclick={() => removeTask(todoId, task.id)}>Remove</button>
    </li>
  {/each}
</ul>
