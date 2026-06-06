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


router.get('/', getTasks);


router.post('/', validateTask, createTask);


router.patch('/reorder', reorderTasks);

router.put('/:id', validateTask, updateTask);


router.patch('/:id/status', toggleStatus);


router.delete('/:id', deleteTask);

export default router;
