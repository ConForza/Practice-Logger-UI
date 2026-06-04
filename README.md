# Practice Logger UI

React frontend for a FastAPI-powered music practice tracking application.

This project is part of a full-stack portfolio app designed for music students and teachers. Students can manage practice tasks, start and end practice sessions, and review session history. Teachers can view registered students, inspect student practice history, and assign practice tasks.

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

### Layout and UI

- Responsive app shell
- Navbar with current role display
- Sidebar navigation for desktop
- Bottom navigation on mobile
- Sidebar view switching
- Loading and error states

## Tech stack

- React
- Vite
- JavaScript
- CSS
- FastAPI backend integration

## Related backend

This frontend connects to the Practice Logger FastAPI backend:

[Practice Logger Backend]https://github.com/ConForza/Practice-Logger-Backend

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
        ├── StudentList.jsx
        ├── StudentSessionList.jsx
        └── TeacherDashboard.jsx
```

## Current status

The student dashboard is functional. Teacher mode now supports viewing students, reviewing selected student practice sessions, and assigning practice tasks. Admin mode currently has placeholder dashboard views, with user-management features planned next.

## Planned improvements

- Admin user management
- Role management from the admin dashboard
- User activation/deactivation
- Teacher assignment overview
- Improved automated tests
- Deployment
- Screenshots and demo video
