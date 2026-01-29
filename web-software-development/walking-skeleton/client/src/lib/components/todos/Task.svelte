<script>
  import { getTasks, setTasksForTodo } from "$lib/states/taskState.svelte.js";
  import { readOne } from "$lib/apis/tasksApi.js";
  import { browser } from '$app/environment';

  let { todoId, taskId } = $props();

  // @ts-ignore
  let task = $derived(getTasks(todoId).find((t) => t.id === parseInt(taskId)));

  $effect(async () => {
    if (browser && taskId && todoId) {
      try {
        const taskData = await readOne(parseInt(todoId), parseInt(taskId));
        const arr = getTasks(parseInt(todoId));
        const existing = arr.find((t) => t.id === parseInt(taskId));
        if (!existing) {
          if (arr.length > 0) {
            arr.push(taskData);
          } else {
            setTasksForTodo(parseInt(todoId), [taskData]);
          }
        }
      } catch (error) {
        console.error("Failed to load task:", error);
      }
    }
  });
</script>

<h1>{task ? task.description : "Loading..."}</h1>
{#if task}
  <p>Status: {task.is_done ? 'Done' : 'Not done'}</p>
{/if}
