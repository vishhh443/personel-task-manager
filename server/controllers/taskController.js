import { v4 as uuidv4 } from 'uuid';
import { readTasks, writeTasks } from '../services/taskService.js';

/**
 * GET /api/tasks
 * Fetch all tasks in current storage order (defaults to newest first upon creation).
 */
export const getTasks = async (req, res, next) => {
  try {
    const tasks = readTasks();
    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks
 * Create a new task. The new task is prepended to the array (sorting by newest first).
 */
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate } = req.body;
    const tasks = readTasks();

    const newTask = {
      id: uuidv4(),
      title: title.trim(),
      description: (description || '').trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Prepend to array to satisfy "sorted by newest first" by default
    tasks.unshift(newTask);
    writeTasks(tasks);

    return res.status(201).json({
      success: true,
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/tasks/:id
 * Update title, description, and due date of an existing task.
 */
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      title: title.trim(),
      description: (description || '').trim(),
      dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : null,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    return res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/:id/status
 * Toggle completion status of an existing task.
 */
export const toggleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      completed: !tasks[taskIndex].completed,
      updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    writeTasks(tasks);

    return res.status(200).json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete an existing task.
 */
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tasks = readTasks();

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    tasks.splice(taskIndex, 1);
    writeTasks(tasks);

    return res.status(200).json({
      success: true,
      data: { id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/tasks/reorder
 * Reorder task list based on custom drag-and-drop order of IDs.
 */
export const reorderTasks = async (req, res, next) => {
  try {
    const { taskIds } = req.body;

    if (!taskIds || !Array.isArray(taskIds)) {
      return res.status(400).json({
        success: false,
        message: 'Missing or invalid taskIds list. Must be an array of IDs.'
      });
    }

    const tasks = readTasks();
    const taskMap = new Map(tasks.map((t) => [t.id, t]));
    const reorderedTasks = [];

    // Push tasks in requested order
    taskIds.forEach((id) => {
      if (taskMap.has(id)) {
        reorderedTasks.push(taskMap.get(id));
        taskMap.delete(id); // remove to track remaining
      }
    });

    // If any tasks were omitted from the array, append them to the end so they aren't lost
    taskMap.forEach((task) => {
      reorderedTasks.push(task);
    });

    writeTasks(reorderedTasks);

    return res.status(200).json({
      success: true,
      data: reorderedTasks
    });
  } catch (error) {
    next(error);
  }
};
