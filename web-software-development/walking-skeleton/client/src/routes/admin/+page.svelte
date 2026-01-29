<script>
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import { authFetch } from "$lib/utils/fetchUtils.js";
  import { PUBLIC_API_URL } from "$env/static/public";
  import { goto } from "$app/navigation";
  import { get } from "svelte/store";

  const authState = useAuthState();
  let users = $state([]);
  let stat = $state({});

  const loadUsers = async () => {
    const response = await authFetch(`${PUBLIC_API_URL}/api/admin/users`);
    users = await response.json();
  };

  $effect(() => {
    // this could go to a layout file, with a redirect to home if not admin
    if (!authState.user || !authState.user.roles?.includes("ADMIN")) {

      return;

    }

    loadUsers();
    getStats();
  });


  const getStats = async (todoId) => {
    const res = await authFetch(`${PUBLIC_API_URL}/api/admin/stats`);
    if (!res.ok) throw new Error(res.statusText);
    stat = await res.json();
  }

</script>

<h1>Users</h1>

<ul>
  {#each users as user}
    <li>{user.email} - Roles: {user.roles?.join(", ")}</li>
  {/each}
</ul>

<p>Todos: {stat.todos}, tasks: {stat.tasks}</p>
