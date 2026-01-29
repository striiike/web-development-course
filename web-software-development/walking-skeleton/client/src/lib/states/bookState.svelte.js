import * as booksApi from '$lib/apis/booksApi.js';
import { browser } from '$app/environment';

export let books = $state([]);
let inited = $state(false);

export function useBookState() {
  return {
    get books() {
      return books;
    },

    async initializeBooks() {
      if (inited) return;
      try {
        const list = await booksApi.readAll();
        books.length = 0;
        for (const b of list) books.push(b);
        inited = true;
      } catch (e) {
        console.error('Failed to initialize books:', e);
        books.length = 0;
      }
    },

    async initializeBook(bookId) {
      try {
        const b = await booksApi.readOne(bookId);
        const idx = books.findIndex((x) => x.id === b.id);
        if (idx === -1) books.push(b);
        else books[idx] = b;
        return b;
      } catch (e) {
        console.error('Failed to initialize book:', e);
        throw e;
      }
    },

    async addBook(book) {
      try {
        const created = await booksApi.create(book);
        books.push(created);
        return created;
      } catch (e) {
        console.error('Failed to add book:', e);
        throw e;
      }
    },

    async removeBook(bookOrId) {
      try {
        const id = typeof bookOrId === 'number' ? bookOrId : bookOrId.id;
        await booksApi.remove(id);
        const newBooks = books.filter((b) => b.id !== id);
        books.length = 0;
        for (const b of newBooks) books.push(b);
      } catch (e) {
        console.error('Failed to remove book:', e);
        throw e;
      }
    },
  };
}

export default useBookState;
