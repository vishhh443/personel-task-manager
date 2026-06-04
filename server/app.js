import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');

// Enable CORS for our frontend client (standard and custom dev origins supported)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parser
app.use(express.json());

// Task Routes
app.use('/api/tasks', taskRoutes);

// Serve frontend build for non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

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
