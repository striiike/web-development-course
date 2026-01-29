<script>
  import { useBookState } from "$lib/states/bookState.svelte.js";
  import { browser } from '$app/environment';
  import Book from "$lib/components/books/Book.svelte";

  let { data } = $props();

  const bookState = useBookState();

  $effect(async () => {
    if (browser && data.bookId) {
      try {
        await bookState.initializeBook(data.bookId);
      } catch (error) {
        console.error("Failed to initialize book:", error);
      }
    }
  });
</script>

<Book bookId={data.bookId} />
