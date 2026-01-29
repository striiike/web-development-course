import * as bookRepository from "../repositories/bookRepository.js";

const readAll = async (c) => {
  try {
    const list = await bookRepository.findAll();
    return c.json(list);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to read books' }, 500);
  }
};

const readOne = async (c) => {
  try {
    const id = parseInt(c.req.param('bookId'));
    const book = await bookRepository.findById(id);
    if (!book) return c.json({ error: 'Not found' }, 404);
    return c.json(book);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to read book' }, 500);
  }
};

const create = async (c) => {
  try {
    const payload = await c.req.json();
    const created = await bookRepository.create(payload);
    return c.json(created, 201);
  } catch (err) {
    console.error('bookController.create error:', err);
    return c.json({ error: 'Failed to create book' }, 500);
  }
};

const deleteOne = async (c) => {
  try {
    const id = parseInt(c.req.param('bookId'));
    const deleted = await bookRepository.deleteById(id);
    if (!deleted) return c.json({ error: 'Book not found' }, 404);
    return c.json(deleted);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Failed to delete book' }, 500);
  }
};

export { readAll, readOne, create, deleteOne };
