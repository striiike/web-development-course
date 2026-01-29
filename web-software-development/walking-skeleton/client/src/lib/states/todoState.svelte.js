import { browser } from "$app/environment";
import * as todosApi from "$lib/apis/todosApi.js";
import * as tasksApi from "$lib/apis/tasksApi.js";
import { setTasksForTodo } from "./taskState.svelte.js";

// Todos are stored server-side via API. The `todos` shared state mirrors server
// data and is kept in memory here. Tasks remain in localStorage (handled in taskState).
export let todos = $state([]);
let initializedTodos = $state(false);


export function getTodos() {
  return todos;
}

export async function initTodos() {
  try {
    const list = await todosApi.readAll();
    // replace the array content so reactivity keeps working
    todos.length = 0;
    for (const t of list) todos.push(t);
  } catch (err) {
    console.error('Failed to init todos from API', err);
    todos.length = 0;
  }
}

export async function initializeTodos() {
  if (initializedTodos) return;
  try {
    const list = await todosApi.readAll();
    // replace the array content so reactivity keeps working
    todos.length = 0;
    for (const t of list) todos.push(t);
    initializedTodos = true;
  } catch (err) {
    console.error('Failed to initialize todos from API', err);
    todos.length = 0;
  }
}

export async function initializeTodo(todoId) {
  try {
    const todo = await todosApi.readOne(todoId);
    const idx = todos.findIndex((t) => t.id === todo.id);
    if (idx === -1) {
      todos.push(todo);
    } else {
      todos[idx] = todo;
    }
    return todo;
  } catch (err) {
    console.error('Failed to initialize todo:', err);
    throw err;
  }
}

export async function initializeTasks(todoId) {
  try {
    const tasks = await tasksApi.readAll(todoId);
    setTasksForTodo(todoId, tasks);
    return tasks;
  } catch (err) {
    console.error('Failed to initialize tasks:', err);
    throw err;
  }
}

export async function addTodo(todo) {
  // todo: { name }
  try {
    const created = await todosApi.create(todo);
    console.log('✅ addTodo: received created todo from API:', created);
    todos.push(created);
    console.log('✅ addTodo: todos after push:', todos);
    return created;
  } catch (err) {
    console.error('❌ Failed to add todo via API', err);
    throw err;
  }
}

export async function removeTodo(id) {
  try {
    await todosApi.remove(id);
    // update local state
    const newTodos = todos.filter(todo => todo.id !== id);
    // replace content
    todos.length = 0;
    for (const t of newTodos) todos.push(t);
  } catch (err) {
    console.error('Failed to remove todo via API', err);
    throw err;
  }
}

export async function updateTodo(id, data) {
  try {
    const updated = await todosApi.update(id, data);
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].id === updated.id) {
        todos[i] = updated;
        break;
      }
    }
    return updated;
  } catch (err) {
    console.error('Failed to update todo via API', err);
    throw err;
  }
}

export async function getTodoById(id) {
  // try local cache first
  const found = todos.find((t) => t.id === id);
  if (found) return found;
  // otherwise fetch from API
  try {
    const one = await todosApi.readOne(id);
    todos.push(one);
    return one;
  } catch (err) {
    console.error('Failed to fetch todo', err);
    throw err;
  }
}

export function setTodo(todo) {
  if (!todo) return;
  const idx = todos.findIndex((t) => t.id === todo.id);
  if (idx === -1) {
    todos.push(todo);
  } else {
    todos[idx] = todo;
  }
}

export function setTodos(list) {
  if (!Array.isArray(list)) return;
  todos.length = 0;
  for (const t of list) todos.push(t);
}
