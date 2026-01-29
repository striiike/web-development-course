<script>
  import { useBookState } from "$lib/states/bookState.svelte.js";

  let bookState = useBookState();
  import { useAuthState } from '$lib/states/authState.svelte.js';
  const authState = useAuthState();

  const addBook = (e) => {
    e.preventDefault();

    const book = Object.fromEntries(new FormData(e.target));
    bookState.addBook(book);
    e.target.reset();
  };
</script>

{#if authState.user}
  <form onsubmit={addBook} class="space-y-4">
  <label class="label">
    <span class="label-text">Title</span>
    <input
      class="input"
      id="title"
      name="title"
      type="text"
      placeholder="Book title"
      required
    />
  </label>

  <label class="label">
    <span class="label-text">Author</span>
    <input
      class="input"
      id="author"
      name="author"
      type="text"
      placeholder="Author name"
      required
    />
  </label>

  <label class="label">
    <span class="label-text">ISBN</span>
    <input
      class="input"
      id="isbn"
      name="isbn"
      type="text"
      placeholder="ISBN (optional)"
    />
  </label>

  <label class="label">
    <span class="label-text">Description</span>
    <textarea
      class="input"
      id="description"
      name="description"
      placeholder="Enter book description"
      rows="4"
    ></textarea>
  </label>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="label">
      <span class="label-text">Published Date</span>
      <input
        class="input"
        id="published_at"
        name="published_at"
        type="date"
        required
      />
    </label>

    <label class="label">
      <span class="label-text">Page Count</span>
      <input
        class="input"
        id="page_count"
        name="page_count"
        type="number"
        min="1"
        placeholder="e.g., 250"
        required
      />
    </label>
  </div>

  <button class="w-full btn preset-filled-primary-500" type="submit">
    Add Book
  </button>
  </form>
{:else}
  <p class="text-sm">Please <a class="anchor" href="/auth/login">login</a> to add books.</p>
{/if}