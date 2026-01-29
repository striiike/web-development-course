<script>
    let { id } = $props();
    
    let exercises = $state([]);
    let loading = $state(true);
    let error = $state(null);

    async function fetchExercises() {
        try {
            const response = await fetch(`/api/languages/${id}/exercises`);
            if (!response.ok) {
                throw new Error('Failed to fetch exercises');
            }
            exercises = await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    fetchExercises();
</script>

<h1>Available exercises</h1>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else}
    <ul>
        {#each exercises as exercise}
            <li><a href="/exercises/{exercise.id}">{exercise.title}</a></li>
        {/each}
    </ul>
{/if}
