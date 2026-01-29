<script>
  import { useBookState } from "$lib/states/bookState.svelte.js";
  import { useAuthState } from "$lib/states/authState.svelte.js";
  import BookReadingProgress from "$lib/components/books/BookReadingProgress.svelte";

  let { bookId } = $props();

  let bookState = useBookState();
  let authState = useAuthState();

  let book = $derived(bookState.books.find((book) => book.id === bookId));

  $effect(() => {
    // ensure book is loaded
    bookState.initializeBook(bookId).catch(() => {});
  });
</script>

<h1>{book ? book.title : "Loading..."}</h1>

{#if book}
  <p><strong>Description:</strong> {book.description}</p>
  <p><strong>Published at:</strong> {book.published_at}</p>
  <p><strong>Page count:</strong> {book.page_count}</p>

  {#if authState.user}
    <BookReadingProgress {bookId} />
  {:else}
    <p>
      <a href="/auth/login">Log in</a> to track your reading progress.
    </p>
  {/if}
{/if}