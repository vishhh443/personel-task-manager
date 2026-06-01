import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  toggleStatus,
  deleteTask,
  reorderTasks
} from '../controllers/taskController.js';
import { validateTask } from '../middleware/validator.js';

const router = Router();

// Retrieve all tasks
router.get('/', getTasks);

// Create task with title validation
router.post('/', validateTask, createTask);

// Reorder tasks (must go before dynamic :id route to prevent collision, although /reorder is fixed)
router.patch('/reorder', reorderTasks);

// Update task title, description, due date
router.put('/:id', validateTask, updateTask);

// Toggle completion status
router.patch('/:id/status', toggleStatus);

// Delete a task
router.delete('/:id', deleteTask);

export default router;
