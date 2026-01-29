import * as taskRepository from './taskRepository.js';

const validateId = (idString, paramName) => {
    if (!/^\d+$/.test(idString)) {
        return { error: `Invalid ${paramName}` };
    }
    const id = Number.parseInt(idString, 10);
    if (id <= 0) {
        return { error: `Invalid ${paramName}` };
    }
    return { id: id };
};

async function create(c) {
    const todoIdString = c.req.param("todoId");
    const todoIdResult = validateId(todoIdString, "todo id");

    if (todoIdResult.error) {
        return c.json({ "error": todoIdResult.error }, 400);
    }
    const todoId = todoIdResult.id;

    let data;
    try {
        data = await c.req.json();
    } catch (e) {
        return c.json({ "error": "Invalid JSON body" }, 400);
    }

    const { description } = data;

    if (!description || typeof description !== 'string' || description.trim() === '') {
        return c.json({ "error": "Missing required fields" }, 400);
    }
    
    const taskData = {
        description: description,
        is_done: data.is_done === true || data.is_done === false ? data.is_done : false
    };

    const user = c.get("user");
    const newTask = await taskRepository.create(user.id, todoId, taskData);
    
    if (!newTask) {
        return c.json({ "error": "Todo not found" }, 404);
    }
    
    return c.json(newTask, 201);
}

async function readAll(c) {
    const todoIdString = c.req.param("todoId");
    const todoIdResult = validateId(todoIdString, "todo id");

    if (todoIdResult.error) {
        return c.json({ "error": todoIdResult.error }, 400);
    }
    const todoId = todoIdResult.id;

    const user = c.get("user");
    const tasks = await taskRepository.findAll(user.id, todoId);
    
    if (tasks === null) {
        return c.json({ "error": "Todo not found" }, 404);
    }

    return c.json(tasks, 200);
}

async function readOne(c) {
    const taskIdString = c.req.param("taskId");
    const taskIdResult = validateId(taskIdString, "task id");

    if (taskIdResult.error) {
        return c.json({ "error": taskIdResult.error }, 400);
    }
    const taskId = taskIdResult.id;

    const user = c.get("user");
    const task = await taskRepository.findById(user.id, taskId);
    
    if (!task) {
        return c.json({ "error": "Task not found" }, 404);
    }
    
    return c.json(task, 200);
}

async function update(c) {
    const taskIdString = c.req.param("taskId");
    const taskIdResult = validateId(taskIdString, "task id");

    if (taskIdResult.error) {
        return c.json({ "error": taskIdResult.error }, 400);
    }
    const taskId = taskIdResult.id;

    let data;
    try {
        data = await c.req.json();
    } catch (e) {
        return c.json({ "error": "Invalid JSON body" }, 400);
    }

    const { description, is_done } = data;

    const isDonePresent = is_done === true || is_done === false;
    
    if (!description || typeof description !== 'string' || description.trim() === '' || !isDonePresent) {
        return c.json({ "error": "Missing required fields" }, 400);
    }

    const taskData = { description, is_done };

    const user = c.get("user");
    const updatedTask = await taskRepository.updateById(user.id, taskId, taskData);

    if (!updatedTask) {
        return c.json({ "error": "Task not found" }, 404);
    }

    return c.json(updatedTask, 200);
}

async function deleteOne(c) {
    const taskIdString = c.req.param("taskId");
    const taskIdResult = validateId(taskIdString, "task id");

    if (taskIdResult.error) {
        return c.json({ "error": taskIdResult.error }, 400);
    }
    const taskId = taskIdResult.id;

    const user = c.get("user");
    const deletedTask = await taskRepository.deleteById(user.id, taskId);

    if (!deletedTask) {
        return c.json({ "error": "Task not found" }, 404);
    }

    return c.json(deletedTask, 200);
}

export { create, readAll, readOne, update, deleteOne };