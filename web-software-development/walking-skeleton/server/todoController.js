import * as todoRepository from './todoRepository.js';

const validateId = (idString) => {
    if (!/^\d+$/.test(idString)) {
        return null;
    }
    const id = Number.parseInt(idString, 10);
    return id > 0 ? id : null;
};

// POST /api/todos
export async function create(c) {
    const user = c.get("user");
    let data;
    try {
        data = await c.req.json();
    } catch (e) {
        return c.json({ "error": "Invalid JSON body" }, 400);
    }

    const todoName = data?.name;

    if (!todoName || typeof todoName !== 'string' || todoName.trim() === '') {
        return c.json({ "error": "Missing required fields" }, 400);
    }

    try {
        const newTodo = await todoRepository.create(user.id, data);
        console.log(newTodo);
        return c.json(newTodo, 201);
    } catch (error) {
        return c.json({ "error": "Todo name must be unique" }, 400);
    }
}

// GET /api/todos
export async function readAll(c) {
    const user = c.get("user");
    const todos = await todoRepository.findAll(user.id);
    return c.json(todos, 200);

}

// GET /api/todos/:todoId
export async function readOne(c) {
    const user = c.get("user");
    const todoIdString = c.req.param("todoId");
    const todoId = validateId(todoIdString);

    if (todoId === null) {
        return c.json({ "error": "Invalid todo id" }, 400);
    }

    const todo = await todoRepository.findById(user.id, todoId);
    if (!todo) {
        return c.json({ "error": "Todo not found" }, 404);
    }
    return c.json(todo, 200);

}

// PUT /api/todos/:todoId
export async function update(c) {
    const user = c.get("user");
    const todoIdString = c.req.param("todoId");
    const todoId = validateId(todoIdString);

    if (todoId === null) {
        return c.json({ "error": "Invalid todo id" }, 400);
    }

    let data;
    try {
        data = await c.req.json();
    } catch (e) {
        return c.json({ "error": "Invalid JSON body" }, 400);
    }

    try {
        const updatedTodo = await todoRepository.updateById(user.id, todoId, data);

        if (!updatedTodo) {
            return c.json({ "error": "Todo not found" }, 404);
        }

        return c.json(updatedTodo, 200);

    } catch (error) {
        return c.json({ "error": "Missing required fields" }, 404);

    }
}

// DELETE /api/todos/:todoId
export async function deleteOne(c) {
    const user = c.get("user");
    const todoIdString = c.req.param("todoId");
    const todoId = validateId(todoIdString);

    if (todoId === null) {
        return c.json({ "error": "Invalid todo id" }, 400);
    }


    const deletedTodo = await todoRepository.deleteById(user.id, todoId);

    if (!deletedTodo) {
        return c.json({ "error": "Todo not found" }, 404);
    }

    return c.json(deletedTodo, 200);

}