<script>
  import * as readingProgressApi from "$lib/apis/readingProgressApi.js";

  let progress = $state([]);
  let selectedFilter = $state("all");

  const statusLabels = {
    want_to_read: "Want to Read",
    reading: "Currently Reading",
    finished: "Finished"
  };

  const fetchProgress = async () => {
    const status = selectedFilter === "all" ? null : selectedFilter;
    const response = await readingProgressApi.getUserProgress(status);
    progress = await response.json();
  };

  $effect(() => {
    fetchProgress();
  });
</script>

<h2>My Reading List</h2>

<label>
  <span>Filter by status:</span>
  <select bind:value={selectedFilter}>
    <option value="all">All Books</option>
    <option value="want_to_read">Want to Read</option>
    <option value="reading">Currently Reading</option>
    <option value="finished">Finished</option>
  </select>
</label>

{#if progress.length === 0}
  <p>No books found. Start tracking your reading!</p>
{:else}
  <ul>
    {#each progress as item}
      <li>
        <a href="/books/{item.book_id}"><strong>{item.title}</strong></a>
        - {statusLabels[item.status]}
      </li>
    {/each}
  </ul>
{/if}