# TaskFlow - Personal Task Manager

A Personal Task Manager web app built, FULL STACK WEB APPLICATION. The application includes a React + Vite frontend and a Node.js + Express backend, with drag-and-drop task reordering, task completion toggles, filtering, and file-based persistence.

## Live Demo Links

- Frontend: https://personel-task-manager-3.onrender.com (you can view the live application here)
- Backend API: https://personel-task-manager-1.onrender.com

## Tech Stack

- **React + Vite**: Fast frontend rendering, simple project setup, and optimized build output.
- **Tailwind CSS**: Utility-first styling for a clean and responsive UI without writing custom CSS boilerplate.
- **@dnd-kit**: Provides accessible drag-and-drop support for task reordering.
- **Axios**: HTTP client for frontend requests with centralized response handling.
- **Express.js**: Lightweight REST API framework for task CRUD and reorder endpoints.
- **Node.js**: Backend runtime for API services and file I/O.
- **UUID**: Generates unique task IDs.
- **Vitest + Supertest**: Backend integration tests for API contract and request validation.

## How to Run Locally

### Prerequisite

- Node.js installed (v16+ recommended)

### Start the backend

```bash
cd server
npm install
npm run dev
```

### Start the frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend at: http://localhost:5173

## API Documentation

### Common response shape

```json
{
  "success": true,
  "data": { ... }
}
```

### Endpoints

| Method | Path | Request body | Response shape |
| --- | --- | --- | --- |
| GET | `/api/tasks` | None | `{ success: true, data: [Task] }` |
| POST | `/api/tasks` | `{ title: string, description?: string, dueDate?: string }` | `{ success: true, data: Task }` |
| PUT | `/api/tasks/:id` | `{ title: string, description?: string, dueDate?: string }` | `{ success: true, data: Task }` |
| PATCH | `/api/tasks/:id/status` | None | `{ success: true, data: Task }` |
| PATCH | `/api/tasks/reorder` | `{ taskIds: string[] }` | `{ success: true, data: Task[] }` |
| DELETE | `/api/tasks/:id` | None | `{ success: true, data: { id: string } }` |

### Task object shape

```json
{
  "id": "uuid",
  "title": "Task title",
  "description": "Optional description",
  "dueDate": "YYYY-MM-DD" | null,
  "completed": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## Project Structure

```
client/
  src/
    components/     # UI components for task cards, lists, search, filters, modals
    context/        # Task state provider and hooks
    services/       # Axios API client
    App.jsx         # App wrapper and providers
    main.jsx        # React mount point
  package.json      # frontend dependencies and scripts

server/
  controllers/     # Task API request handlers
  routes/          # Express route definitions
  services/        # JSON file read/write helpers
  middleware/      # error handling and validation
  tests/           # backend API tests
  app.js           # Express app and CORS setup
  package.json     # backend dependencies and scripts
```

## Next Steps

- Add user authentication and multi-user task separation.
- Replace file-based storage with a database such as PostgreSQL or MongoDB.
- Add task categories, tags, and priority levels.
- Improve offline support with local storage caching and sync logic.
- Add pagination or virtualized lists for large task sets.
