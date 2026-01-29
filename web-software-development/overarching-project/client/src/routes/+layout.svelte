<script>
	import favicon from '$lib/assets/favicon.svg';
	import { useAuthState } from '$lib/states/authState.svelte.js';
	import { goto } from '$app/navigation';

	let { children } = $props();
	const authState = useAuthState();

	const handleLogout = () => {
		authState.logout();
		goto('/');
	};
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen bg-surface-50">
	<header class="bg-primary-500 text-white shadow-lg">
		<nav class="max-w-6xl mx-auto px-4 py-4">
			<div class="flex justify-between items-center">
				<div class="flex gap-8">
					<a href="/" class="text-xl font-bold hover:text-primary-100 transition">Home</a>
					<a href="/communities" class="text-lg hover:text-primary-100 transition">Communities</a>
				</div>
				<div class="flex gap-4 items-center">
					{#if authState.user}
						<p class="text-sm">Hello, {authState.user.email}!</p>
						<button onclick={handleLogout} class="btn preset-filled-primary-500 variant-soft text-sm">Logout</button>
					{:else}
						<p class="text-sm">Hello anonymous!</p>
						<a href="/auth/login" class="btn preset-filled-primary-500 variant-soft text-sm">Login</a>
						<a href="/auth/register" class="btn preset-filled-primary-500 variant-soft text-sm">Register</a>
					{/if}
				</div>
			</div>
		</nav>
	</header>

	<main class="grow max-w-6xl mx-auto w-full px-4 py-8">
		{@render children?.()}
	</main>

	<footer class="bg-surface-700 text-white text-center py-6 mt-12">
		<p>&copy; 2025 Community Platform. All rights reserved.</p>
	</footer>
</div>

<style global>
	:root {
		--primary-500: #0066cc;
		--primary-100: #cce0ff;
	}

	body {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.btn {
		display: inline-block;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}

	.btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.preset-filled-primary-500 {
		background-color: var(--primary-500);
		color: white;
	}

	.preset-filled-primary-500:hover {
		background-color: #0052a3;
	}

	.variant-soft {
		background-color: rgba(0, 102, 204, 0.1);
		color: var(--primary-500);
	}

	.variant-soft:hover {
		background-color: rgba(0, 102, 204, 0.2);
	}

	.surface-50 {
		background-color: #f9fafb;
	}

	.surface-700 {
		background-color: #374151;
	}
</style>
