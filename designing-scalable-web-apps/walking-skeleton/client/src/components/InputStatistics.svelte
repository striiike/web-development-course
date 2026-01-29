<script>
    let count = $state("");
    let sum = $state(0);
    let items = $state([]);

    function handleInput(event) {
        sum += parseInt(count) || 0;
        items = [...items, count];
        console.log(`Current count: ${count}, Cumulative sum: ${sum}`);

        count = "";
    }
</script>

<ul>
    {#each items as item}
        <li>{item}</li>
    {/each}
</ul>

<input type="number" bind:value={count} />
<button on:click={handleInput}>Add to Sum</button>
<p>Sum: {sum}</p>
<p>Total numbers: {items.length}</p>
