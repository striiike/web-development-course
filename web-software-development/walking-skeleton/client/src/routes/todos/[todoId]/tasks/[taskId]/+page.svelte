<script>
  import Task from "$lib/components/todos/Task.svelte";

  let { data } = $props();
</script>

<Task todoId={data.todoId} taskId={data.taskId} />
