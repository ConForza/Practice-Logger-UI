# Practice Tracker UI

React frontend for a FastAPI-powered music practice tracking application.

This project is part of a full-stack portfolio app designed for music students and teachers. Students can manage practice tasks, start and end practice sessions, and review session history. The frontend connects to a FastAPI backend with JWT authentication and role-aware user state.

## Current features

- Login and registration flow
- JWT token storage and restore
- Current user fetch via `/auth/me`
- Role-based dashboard rendering
- Student dashboard with task management
- Start and end practice sessions
- Active practice session restore
- Session history view
- Responsive app shell with navbar and sidebar
- Mobile bottom navigation
- Sidebar view switching
- Placeholder teacher and admin dashboards

## Tech stack

- React
- Vite
- JavaScript
- CSS
- FastAPI backend integration

## Related backend

This frontend connects to the Practice Logger FastAPI backend:

```txt
[Practice Logger Backend] https://github.com/ConForza/Practice-Logger-Backend
```

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

├── App.jsx
├── App.css
├── services/
│   └── api.js
└── components/
    ├── LoginForm.jsx
    ├── admin/
    │   └── AdminDashboard.jsx
    ├── layout/
    │   ├── AppShell.jsx
    │   ├── Navbar.jsx
    │   └── Sidebar.jsx
    ├── student/
    │   ├── ActiveSessionPanel.jsx
    │   ├── SessionHistorySection.jsx
    │   ├── SessionList.jsx
    │   ├── StudentDashboard.jsx
    │   ├── TaskForm.jsx
    │   ├── TaskList.jsx
    │   └── TaskSection.jsx
    └── teacher/
        └── TeacherDashboard.jsx
```

## Current status

The student dashboard is functional. Teacher and admin dashboards are currently placeholders, with role-aware navigation already in place.

## Planned improvements

- Teacher dashboard student list
- Teacher view of student practice history
- Teacher task assignment
- Admin user management
- Improved loading and error states
- Deployment
- Screenshots and demo video
