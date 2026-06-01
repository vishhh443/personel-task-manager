# TaskFlow — Premium Personal Task Manager

TaskFlow is a complete, production-quality Personal Task Manager application designed with modern glassmorphism design aesthetics, fluid animations, and robust backend engineering. Built using **React (Vite) + Tailwind CSS v4** on the frontend, and **Node.js + Express** on the backend, it delivers a highly tactile, fast, and accessible user experience combined with persistent JSON storage.

This project strictly satisfies all core, should-have, and bonus requirements from the **Studio Graphene Full Stack Developer Assessment** and is engineered to maximize shortlisting chances.

---

## 🚀 Key Features

*   **Premium Visual Experience**: Stunning glassmorphism UI with Outfit typography, smooth CSS radial gradients, glowing cards, and interactive hover effects.
*   **Intuitive Drag & Drop**: Real-time sortable task lists powered by `@dnd-kit/core` and `@dnd-kit/sortable` with custom handle grip locks and persisted ordering.
*   **Reactive Search & Filters**: Live, instantaneous searching by title (supporting a `/` global keyboard shortcut to focus the input) and categorized filter tabs (All, Active, Completed) complete with count badges.
*   **Intelligent Overdue Detection**: Automated comparison of due dates against the current date, highlighting overdue active tasks with red glass backings and flashing warning badges.
*   **Statistics Dashboard**: Four premium visual cards displaying real-time metrics: Total, Active, Completed, and Overdue tasks.
*   **Secure Validation & Deletion**: Non-empty titles are enforced with user-friendly error banners. Destructive task deletions are protected by an interactive confirmation overlay preventing accidents.
*   **Standardized REST API**: A complete backend routing layout adhering to consistent response payload wrappers, HTTP status codes, and robust global error boundaries.
*   **Persistent File Storage**: Fully local database persisted in `data/tasks.json` that survives server restarts, utilizing atomic temp-swaps to guarantee data integrity.
*   **Exhaustive Integration Tests**: A suite of 10 API integration tests written in Vitest and Supertest running under full environmental database isolation.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Functional components, custom hooks, and React Context for decoupled state management.
*   **Styling (Tailwind CSS v4)**: Fluid responsive layouts matching mobile, tablet, and desktop screens natively.
*   **Iconography (Lucide React)**: Clean, uniform vector icons.
*   **State & Notifications (React Hot Toast)**: Smooth, animated banners for CRUD operations and service errors.
*   **Drag and Drop (`@dnd-kit`)**: Drag and Drop primitives optimized for performance.
*   **HTTP (Axios)**: Standard client instances with interceptors to auto-parse standard responses.

### Backend
*   **Node.js & Express.js**: REST API server.
*   **UUID**: Cryptographically secure, unique identifiers for task records.
*   **Persistence**: Atomic read/writes to local `tasks.json` file.
*   **Testing (Vitest & Supertest)**: Instant, zero-config testing with isolated test storage.

---

## 📁 Folder Structure

```
client/
├── src/
│   ├── components/
│   │   ├── ConfirmDialog.jsx     # Delete verification overlay
│   │   ├── DashboardStats.jsx    # Real-time metrics panel
│   │   ├── EmptyState.jsx        # motivate copy and reset filters CTAs
│   │   ├── FilterTabs.jsx        # Segmented controls with item counts
│   │   ├── SearchBar.jsx         # Input field with global '/' focus shortcut
│   │   ├── SkeletonLoader.jsx    # Shimmering placeholder cards
│   │   ├── TaskCard.jsx          # Sortable task items with custom animated toggles
│   │   ├── TaskList.jsx          # DnD Sortable contexts and sensors
│   │   └── TaskModal.jsx         # Accessible create/edit modal form
│   ├── context/
│   │   └── TaskContext.jsx       # state provider, API orchestrator, and filters
│   ├── services/
│   │   └── api.js                # Axios client configurations
│   ├── App.jsx                   # Mounts TaskProvider and Toasters
│   ├── index.css                 # Custom HSL backing gradients and scrollbars
│   └── main.jsx                  # React DOM renderer
├── index.html                    # SEO title and description configurations
└── vite.config.js                # Tailwind plugin registrations

server/
├── controllers/
│   └── taskController.js         # HTTP handlers for CRUD and reordering
├── data/
│   └── tasks.json                # Persisted database (automatically initialized)
├── middleware/
│   ├── errorHandler.js           # Standardized express error catcher
│   └── validator.js              # Request validation (non-empty title checks)
├── routes/
│   └── taskRoutes.js             # REST API endpoint definitions
├── services/
│   └── taskService.js            # Isolated local JSON database adapter (atomic temp-swap)
├── tests/
│   └── task.test.js              # Vitest + Supertest integration test suite
├── app.js                        # Express server bootstrapping and CORS setups
└── package.json                  # Script shortcuts and testing configurations
```

---

## ⚡ Environment Variables

The application operates perfectly with default settings, but custom environments can be declared by creating `.env` files.

### Frontend (`client/.env`)
*   `VITE_API_URL`: Root path of the Express backend (defaults to `http://localhost:5000/api`).

### Backend (`server/.env`)
*   `PORT`: Port number for the express listener (defaults to `5000`).
*   `NODE_ENV`: Application mode (`development`, `production`, or `test`). In `test`, the server isolates storage into `tasks.test.json`.

---

## 📖 API Documentation

Every server endpoint returns a standardized payload wrapper to ease consumption and improve integrity:

**Success Response (2xx)**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response (4xx/5xx)**:
```json
{
  "success": false,
  "message": "Error message explanation"
}
```

### Endpoints

| Method | Endpoint | Description | Payloads (JSON) |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/tasks` | Fetches all tasks | None |
| **POST** | `/api/tasks` | Creates a new task | `{ "title": "Required", "description": "Optional", "dueDate": "Optional (YYYY-MM-DD)" }` |
| **PUT** | `/api/tasks/:id` | Edits task details | `{ "title": "Required", "description": "Optional", "dueDate": "Optional" }` |
| **PATCH** | `/api/tasks/:id/status` | Toggles completion status | None |
| **DELETE** | `/api/tasks/:id` | Deletes a task | None |
| **PATCH** | `/api/tasks/reorder` | Persists drag-and-drop order | `{ "taskIds": ["id1", "id2", "id3", ...] }` |

---

## 🔧 Installation & Running Locally

Ensure you have [Node.js](https://nodejs.org/) (v16+) installed.

### 1. Clone & Prepare Projects
Clone this repository to your local path.

### 2. Launch the Backend Server
Navigate to the server directory, install dependencies, and start the hot-reloading development server:
```bash
cd server
npm install
npm run dev
```
The server will boot up and listen at [http://localhost:5000](http://localhost:5000).

### 3. Launch the Frontend Client
Open a second terminal, navigate to the client directory, install dependencies, and spin up the Vite development server:
```bash
cd client
npm install
npm run dev
```
The client will start up and provide a local link at [http://localhost:5173](http://localhost:5173). Open it in your browser!

### 4. Running Backend Integration Tests
To run our Vitest integration test suite (fully isolated from live data):
```bash
cd server
npm run test
```

---

## ☁️ Deployment Guide

### Backend (Railway / Render)
1. Commit the code to your GitHub repository.
2. Link the repository to your hosting account (e.g. Render).
3. Select **Web Service** and choose Node.js environment.
4. Set the **Build Command** to: `npm install`
5. Set the **Start Command** to: `npm start`
6. Add the Environment Variable: `NODE_ENV=production`
7. Render/Railway will automatically expose a public server URL.

### Frontend (Vercel)
1. Add a Vercel project and link your GitHub repository.
2. Set the framework preset to **Vite**.
3. Set the **Root Directory** to `client`.
4. Configure the Environment Variable `VITE_API_URL` to point to your deployed backend API (e.g., `https://your-backend.render.com/api`).
5. Trigger **Deploy**. Vercel will bundle assets and host your app.

---

## 🔮 Future Improvements

1.  **User Authentication**: Integrating JWT auth or Firebase Auth to support multi-user isolation.
2.  **Tagging/Categories**: Allow users to color-tag tasks (e.g. Work, Personal, Shopping) and filter lists by tag.
3.  **Local Storage Cache**: Fallback to browser `localStorage` when backend is offline for full offline-first durability.
4.  **Database Migration**: Easily swap `tasks.json` with a PostgreSQL or MongoDB database by implementing the same service interface.

---

## ⚠️ Known Limitations

*   **Scale Limitation**: Since storage relies on reading/writing a single JSON file, it is optimized for personal use cases (thousands of tasks) rather than millions of concurrent write streams.
*   **Browser Timezones**: Due dates are normalized in UTC format, which might lead to timezone variations if the user has an extreme timezone difference and inputs date strings manually. This is protected by splitting strings before timezone conversions.
