<script>
  import { addTodo } from "$lib/states/todoState.svelte.js";

  let name = $state("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await addTodo({ name: name.trim() });
    } catch (err) {
      // keep UI simple; errors logged in state
    }
    name = "";
  };
</script>

<form onsubmit={handleSubmit}>
  <label for="todoName">Todo name</label>
  <input id="todoName" type="text" bind:value={name} required />
  <button type="submit">Add todo</button>
</form>
