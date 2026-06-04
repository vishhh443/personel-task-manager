# TaskFlow � Personal Task Manager

A simple task manager with a React + Vite frontend and a Node.js + Express backend.

## What it does

- Create, edit, delete tasks
- Mark tasks complete / active
- Reorder tasks using drag and drop
- Filter tasks by All / Active / Completed
- Persist tasks in `server/data/tasks.json`

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Axios, @dnd-kit
- Backend: Node.js, Express, UUID, file-based JSON storage
- Tests: Vitest + Supertest

## Folder structure

```
client/
  src/
    components/
    context/
    services/
    App.jsx
    main.jsx
  package.json

server/
  controllers/
  routes/
  services/
  middleware/
  tests/
  app.js
  package.json
```

## Environment variables

### Frontend (`client/.env`)

- `VITE_API_URL` � backend API URL
  - default: `http://localhost:5000/api`

### Backend (`server/.env`)

- `PORT` � server port (default `5000`)
- `NODE_ENV` � `development`, `production`, or `test`
- `ALLOWED_ORIGINS` � comma-separated frontend URLs allowed by CORS

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/status` | Toggle completion |
| PATCH | `/api/tasks/reorder` | Save task order |
| DELETE | `/api/tasks/:id` | Delete a task |

## Run locally

### Start backend

```bash
cd server
npm install
npm run dev
```

### Start frontend

```bash
cd client
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Deploy

### Backend (Render)

1. Create a Render web service.
2. Set the root directory to `server` if needed.
3. Build command: `npm install`
4. Start command: `npm start`
5. Set env vars:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=https://<your-frontend-url>`

### Frontend (Vercel)

1. Create a Vercel project.
2. Root directory: `client`
3. Set env var:
   - `VITE_API_URL=https://<your-backend-url>/api`

## Connect frontend + backend on Render

- If frontend is deployed at `https://personel-task-manager-3.onrender.com` and backend at `https://personel-task-manager-1.onrender.com`:
  - Frontend `VITE_API_URL=https://personel-task-manager-1.onrender.com/api`
  - Backend `ALLOWED_ORIGINS=https://personel-task-manager-3.onrender.com`

## Tests

```bash
cd server
npm run test
```

## Notes

- The frontend uses `VITE_API_URL` at build time.
- If drag or complete actions fail, check that the backend URL and CORS settings are correct.
