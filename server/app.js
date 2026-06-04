import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for our frontend client (standard and custom dev origins supported)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Task Routes
app.use('/api/tasks', taskRoutes);

// Root route for health check / quick API info
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow backend is running. Use /api/tasks to access the task API.'
  });
});

// Not Found Route handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
});

// Global Error Handler Middleware
app.use(errorHandler);

// Only listen if not in a test environment to prevent EADDRINUSE during testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Server] running on http://localhost:${PORT}`);
  });
}

export default app;
