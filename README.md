# Practice Logger UI

React frontend for a FastAPI-powered music practice tracking application.

This project is part of a full-stack portfolio app designed for music students and teachers. Students can manage practice tasks, start and end practice sessions, and review session history. Teachers can view registered students, inspect student practice history, and assign practice tasks.

## Live App

- Live app: https://practice-logger.netlify.app/
- Backend API: https://practice-logger-backend-production.up.railway.app/
- API docs: https://practice-logger-backend-production.up.railway.app/docs
- Backend repo: https://github.com/ConForza/Practice-Logger-Backend

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- FastAPI backend
- PostgreSQL database
- Netlify

## Current features

### Authentication

- Login and registration flow
- JWT token storage and restore
- Current user fetch via `/auth/me`
- Role-based dashboard rendering

### Student features

- Student dashboard with task management
- Create and delete practice tasks
- Start and end practice sessions
- Active practice session restore
- Session history view
- Helpful empty states for tasks and sessions

### Teacher features

- Teacher dashboard with role-aware navigation
- Student list fetched from the backend
- Selected student detail panel
- Selected student practice session history
- Refresh and retry states for student/session data
- Teacher task assignment form
- Recently assigned task confirmation
- Form validation and success/error feedback

### Admin features

- View user accounts
- Change user roles
- Activate and deactivate accounts
- Protect current admin account from accidental self-demotion or deactivation

### Layout and UI

- Responsive app shell
- Navbar with current role display
- Sidebar navigation for desktop
- Bottom navigation on mobile
- Sidebar view switching
- Loading and error states

## Related backend

This frontend connects to the Practice Logger FastAPI backend:

[Practice Logger Backend](https://github.com/ConForza/Practice-Logger-Backend)

The backend provides:

- JWT authentication
- Register/login endpoints
- Current user endpoint
- Task CRUD
- Practice session start/end
- Active session restore
- Session history
- Role-based access helpers

## Getting started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The backend API should also be running locally.

Example backend command:

```bash
uvicorn main:app --reload
```

## Environment/configuration

The frontend API base URL is currently configured in:

```txt
src/services/api.js
```

For local development, the backend should be available at the URL used by that service file.

## Project structure

```txt
src/
├── components/
│   ├── admin/
│   ├── layout/
│   ├── student/
│   └── teacher/
├── services/
│   └── api.js
├── App.jsx
├── App.css
└── main.jsx
```

## Environment Variables

Create a .env file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

For production on Netlify, this points to the deployed Railway API:

```env
VITE_API_BASE_URL=https://practice-logger-backend-production.up.railway.app/api/v1
```

## Current status

The student dashboard is functional. Teacher mode now supports viewing students, reviewing selected student practice sessions, and assigning practice tasks. Admin mode has basic user management features.

## Planned improvements

- PWA support for phone/tablet installation
- Admin password reset
- Improved teacher-student relationships
- Multi-task practice sessions
- More detailed progress statistics
