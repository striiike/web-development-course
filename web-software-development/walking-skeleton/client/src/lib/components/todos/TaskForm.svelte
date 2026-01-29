<script>
  import { addTask } from "$lib/states/taskState.svelte.js";

  let { todoId } = $props();

  let description = $state("");
  // checkbox default unchecked
  let isDone = $state(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      await addTask(todoId, { description: description.trim(), is_done: !!isDone });
    } catch (err) {
      // errors are logged in addTask
    }
    description = "";
    isDone = false;
  };
</script>

<form onsubmit={handleSubmit}>
  <label for="taskDesc">Task description</label>
  <input id="taskDesc" type="text" bind:value={description} required />

  <label for="isDone">
    <input id="isDone" type="checkbox" bind:checked={isDone} /> Is done
  </label>

  <button type="submit">Add task</button>
</form>
