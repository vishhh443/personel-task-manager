import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import app from '../app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TEST_FILE = path.join(__dirname, '..', 'data', 'tasks.test.json');


process.env.NODE_ENV = 'test';

describe('Task Manager API Integration Tests', () => {
  

  beforeEach(() => {
    try {
      fs.writeFileSync(TEST_FILE, JSON.stringify([], null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to reset test DB:', e);
    }
  });

 
  afterAll(() => {
    try {
      if (fs.existsSync(TEST_FILE)) {
        fs.unlinkSync(TEST_FILE);
      }
    } catch (e) {
      console.error('Failed to delete test DB:', e);
    }
  });

  describe('POST /api/tasks', () => {
    it('should successfully create a task with a valid title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Review PR #12',
          description: 'Check for styling and test coverage',
          dueDate: '2026-06-15',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.title).toBe('Review PR #12');
      expect(response.body.data.description).toBe('Check for styling and test coverage');
      expect(response.body.data.completed).toBe(false);
      expect(response.body.data.dueDate).toBe('2026-06-15');
    });

    it('should fail with 400 Bad Request if title is missing or empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          description: 'A task with no title',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    it('should fetch all tasks, returning an empty list initially', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it('should fetch all created tasks in reverse chronological order by default', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });

      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].title).toBe('Task 2'); // Prepend logic
      expect(response.body.data[1].title).toBe('Task 1');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task details successfully', async () => {
      
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Title', description: 'Original description' });
      const taskId = createRes.body.data.id;

     
      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          title: 'Updated Title',
          description: 'Updated description',
          dueDate: '2026-07-01',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated description');
      expect(response.body.data.dueDate).toBe('2026-07-01');
    });

    it('should return 404 for updating a non-existent task ID', async () => {
      const response = await request(app)
        .put('/api/tasks/non-existent-uuid-123')
        .send({ title: 'New Title' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should toggle a task completed status', async () => {
      const createRes = await request(app).post('/api/tasks').send({ title: 'Test status toggle' });
      const taskId = createRes.body.data.id;

      
      const resToggle1 = await request(app).patch(`/api/tasks/${taskId}/status`);
      expect(resToggle1.status).toBe(200);
      expect(resToggle1.body.data.completed).toBe(true);


      const resToggle2 = await request(app).patch(`/api/tasks/${taskId}/status`);
      expect(resToggle2.status).toBe(200);
      expect(resToggle2.body.data.completed).toBe(false);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      const createRes = await request(app).post('/api/tasks').send({ title: 'Task to Delete' });
      const taskId = createRes.body.data.id;

      const response = await request(app).delete(`/api/tasks/${taskId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const listRes = await request(app).get('/api/tasks');
      expect(listRes.body.data.length).toBe(0);
    });
  });

  describe('PATCH /api/tasks/reorder', () => {
    it('should reorder tasks array order as specified by IDs', async () => {
      const t1 = await request(app).post('/api/tasks').send({ title: 'Task 1' });
      const t2 = await request(app).post('/api/tasks').send({ title: 'Task 2' });
      const id1 = t1.body.data.id;
      const id2 = t2.body.data.id;

     
      const reorderRes = await request(app)
        .patch('/api/tasks/reorder')
        .send({ taskIds: [id1, id2] }); // Reverse the order

      expect(reorderRes.status).toBe(200);
      expect(reorderRes.body.success).toBe(true);
      expect(reorderRes.body.data[0].id).toBe(id1);
      expect(reorderRes.body.data[1].id).toBe(id2);
    });

    it('should fail with 400 if taskIds parameter is not an array', async () => {
      const response = await request(app)
        .patch('/api/tasks/reorder')
        .send({ taskIds: 'not-an-array' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
