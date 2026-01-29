<script>
  import BookList from "$lib/components/books/BookList.svelte";
  import BookForm from "$lib/components/books/BookForm.svelte";
  import { useAuthState } from "$lib/states/authState.svelte.js";

  const authState = useAuthState();
</script>

<!-- {#if authState.user}
  <BookList />
{:else}
  <p>Please <a href="/auth/login">log in</a> to view your reading list.</p>
{/if} -->


<h1 class="text-2xl font-bold text-primary-900 mb-4 mt-4">Books</h1>

<BookList />

<h2 class="text-2xl font-bold text-primary-900 mb-4 mt-4">Add a book</h2>

<BookForm />