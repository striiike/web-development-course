<script>
    let state = $state({
        fact: 'Press the button.',
        loading: false,
        error: null,
    });

    const API_URL = 'https://dogapi.dog/api/v2/facts';

    async function fetchDogFact() {
        state.loading = true;
        state.error = null;
        state.fact = 'Fetching...';

        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Status: ${response.status}`);

            const data = await response.json();
            
            state.fact = data.data?.[0]?.attributes?.body || 'No fact found.';

        } catch (e) {
            state.error = e.message;
            state.fact = 'Failed to load fact.';
        } finally {
            state.loading = false;
        }
    }
</script>

<button 
    onclick={fetchDogFact} 
    disabled={state.loading}
>
    {state.loading ? 'Loading...' : 'Fetch a dog fact'}
</button>

<p>
    {#if state.error}
        <span style="color:red; font-weight:bold;">Error: {state.error}</span>
    {:else}
        {state.fact}
    {/if}
</p>
