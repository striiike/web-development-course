<script>
	import { PUBLIC_API_URL } from '$env/static/public';
	import { useAuthState } from '$lib/states/authState.svelte.js';
	import { initializeHomePage } from '$lib/states/homePageState.svelte.js';
	import HomePageList from '$lib/components/homePage/HomePageList.svelte';

	let todos = $state([]);
	const authState = useAuthState();

	const fetchTodos = async () => {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/api/todos`);
			const data = await response.json();
			todos = data;
		} catch (e) {
			console.error('Failed to fetch todos:', e);
		}
	};

	$effect(() => {
		fetchTodos();
		initializeHomePage();
	});
</script>

<h1 class="text-4xl font-bold text-gray-800 mb-6">Welcome to the home page!</h1>

{#if authState.user}
	<p class="mb-8"><a href="/communities" class="text-primary-600 hover:text-primary-800 hover:underline font-semibold">Go to communities →</a></p>
{/if}

<div class="mb-12">
	<HomePageList />
</div>

<div class="mt-12 pt-8 border-t border-gray-200">
	<h2 class="text-2xl font-bold text-gray-800 mb-6">Todos</h2>

	{#if todos.length === 0}
		<p class="text-gray-500">No todos yet.</p>
	{:else}
		<ul class="space-y-2">
			{#each todos as todo (todo.id)}
				<li class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
					<span class="w-2 h-2 bg-primary-600 rounded-full mr-3"></span>
					{todo.title}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	:global(.primary-600) {
		color: #0052a3;
	}

	:global(.primary-800) {
		color: #003d7a;
	}
</style>
