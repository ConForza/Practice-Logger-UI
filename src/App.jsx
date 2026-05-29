import { useEffect, useState } from "react";
import {
  login,
  register,
  getTasks,
  createTask,
  deleteTask,
  startSession,
  endSession,
  getSessions,
  getActiveSession,
  getCurrentUser,
} from "./services/api";

import "./App.css";
import LoginForm from "./components/LoginForm";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard";
import AppShell from "./components/layout/AppShell";

const TOKEN_STORAGE_KEY = "practiceTrackerToken";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [activeSession, setActiveSession] = useState(null);
  const [startingTaskId, setStartingTaskId] = useState(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(email, password);

      const data = await login(email, password);
      setToken(data.access_token);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      await fetchCurrentUser(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      setToken(data.access_token);
      localStorage.setItem(TOKEN_STORAGE_KEY, data.access_token);
      await fetchCurrentUser(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function clearAuthState() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setEmail("");
    setPassword("");
    setTasks([]);
    setSessions([]);
    setActiveSession(null);
    setSessionNotes("");
    setCurrentUser(null);
  }

  async function fetchCurrentUser(tokenToUse) {
    const userData = await getCurrentUser(tokenToUse);
    setCurrentUser(userData);
    return userData;
  }

  async function isAuthError(message) {
    return (
      message === "Could not validate credentials" ||
      message === "Not authenticated" ||
      message === "Invalid token"
    );
  }

  async function handleCreateTask(taskData) {
    setIsCreatingTask(true);
    setError("");

    try {
      const newTask = await createTask(
        token,
        taskData.title,
        taskData.description,
      );
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleDeleteTask(taskId) {
    setDeletingTaskId(taskId);
    setError("");

    try {
      await deleteTask(token, taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleStartSession(taskId) {
    setStartingTaskId(taskId);
    setError("");

    try {
      await startSession(token, taskId);
      await fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setStartingTaskId(null);
    }
  }

  async function handleEndSession() {
    if (!activeSession) return;

    setIsEndingSession(true);
    setError("");

    try {
      await endSession(token, activeSession.task_id, sessionNotes);

      setSessionNotes("");
      await fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsEndingSession(false);
    }
  }

  async function fetchSessions() {
    setIsLoadingSessions(true);
    setError("");

    try {
      const sessionsData = await getSessions(token);
      setSessions(sessionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingSessions(false);
    }
  }

  async function handleLogout() {
    clearAuthState();
    setError("");
  }

  async function fetchDashboardData(authToken) {
    setError("");
    setLoading(true);

    try {
      const tasksData = await getTasks(authToken);
      const sessionsData = await getSessions(authToken);
      const activeSessionData = await getActiveSession(authToken);

      setTasks(tasksData);
      setSessions(sessionsData);
      setActiveSession(activeSessionData);
    } catch (err) {
      setError(err.message);

      if (isAuthError(err.message)) {
        clearAuthState();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);

    fetchCurrentUser(savedToken)
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken("");
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!token) return;

    fetchDashboardData(token);
  }, [token]);

  function renderDashboard() {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "teacher":
        return (
          <TeacherDashboard currentUser={currentUser} onLogout={handleLogout} />
        );

      case "admin":
        return (
          <AdminDashboard currentUser={currentUser} onLogout={handleLogout} />
        );

      default:
        return (
          <StudentDashboard
            activeSession={activeSession}
            sessionNotes={sessionNotes}
            isEndingSession={isEndingSession}
            tasks={tasks}
            sessions={sessions}
            deletingTaskId={deletingTaskId}
            startingTaskId={startingTaskId}
            isCreatingTask={isCreatingTask}
            onCreateTask={handleCreateTask}
            onEndSession={handleEndSession}
            onSessionNotesChange={(e) => setSessionNotes(e.target.value)}
            onDeleteTask={handleDeleteTask}
            onStartSession={handleStartSession}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
        );
    }
  }

  return (
    <main className="app-container">
      <h1>Practice Tracker</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!token ? (
        <LoginForm
          authMode={authMode}
          email={email}
          password={password}
          loading={loading}
          onEmailChange={(e) => setEmail(e.target.value)}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onToggleMode={() => {
            setError("");
            setAuthMode((prevMode) =>
              prevMode === "login" ? "register" : "login",
            );
          }}
        />
      ) : (
        <AppShell>{renderDashboard()}</AppShell>
      )}
    </main>
  );
}

export default App;
