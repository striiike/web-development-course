<script>
    let languages = $state([]);
    let loading = $state(true);
    let error = $state(null);

    async function fetchLanguages() {
        try {
            const response = await fetch('/api/languages');
            if (!response.ok) {
                throw new Error('Failed to fetch languages');
            }
            languages = await response.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    fetchLanguages();
</script>

<h1>Available languages</h1>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else}
    <ul>
        {#each languages as language}
            <li><a href="/languages/{language.id}">{language.name}</a></li>
        {/each}
    </ul>
{/if}
