import { useEffect, useState } from "react";
import {
  login,
  register,
  getTasks,
  createTask,
  deleteTask,
  startPracticeSession,
  setCurrentTask,
  clearCurrentTask,
  endPracticeSession,
  updateTaskStatus,
  getSessions,
  getActiveSession,
  getCurrentUser,
} from "./services/api";

import "./App.css";
import LoginForm from "./components/LoginForm";
import StudentDashboard from "./components/student/StudentDashboard";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
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
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [taskActionId, setTaskActionId] = useState(null);
  const [isClearingCurrentTask, setIsClearingCurrentTask] = useState(false);
  const [taskStatusActionId, setTaskStatusActionId] = useState(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activeView, setActiveView] = useState("dashboard");

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
    setActiveView("dashboard");
  }

  async function fetchCurrentUser(tokenToUse) {
    const userData = await getCurrentUser(tokenToUse);
    setCurrentUser(userData);
    return userData;
  }

  function isAuthError(message) {
    return (
      message === "Could not validate credentials" ||
      message === "Not authenticated" ||
      message === "Invalid token" ||
      message === "Account is inactive"
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

  async function handleStartSession(taskId = null) {
    setIsStartingSession(true);
    setError("");

    try {
      const session = await startPracticeSession(token, taskId);
      setActiveSession(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsStartingSession(false);
    }
  }

  async function handlePracticeTask(taskId) {
    if (!activeSession) {
      await handleStartSession(taskId);
      return;
    }

    setTaskActionId(taskId);
    setError("");

    try {
      const session = await setCurrentTask(token, activeSession.id, taskId);
      setActiveSession(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskActionId(null);
    }
  }

  async function handleClearCurrentTask() {
    if (!activeSession) return;

    setIsClearingCurrentTask(true);
    setError("");

    try {
      const session = await clearCurrentTask(token, activeSession.id);
      setActiveSession(session);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsClearingCurrentTask(false);
    }
  }

  async function handleTaskStatusChange(taskId, status) {
    setTaskStatusActionId(taskId);
    setError("");

    try {
      const updatedTask = await updateTaskStatus(token, taskId, status);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task)),
      );

      if (activeSession?.current_task_id === taskId && status === "completed") {
        const refreshedSession = await getActiveSession(token);
        setActiveSession(refreshedSession);
      } else {
        setActiveSession((currentSession) => {
          if (!currentSession) return currentSession;

          return {
            ...currentSession,
            tasks: (currentSession.tasks || []).map((task) =>
              task.id === taskId ? { ...task, status } : task,
            ),
          };
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setTaskStatusActionId(null);
    }
  }

  async function handleEndSession() {
    if (!activeSession) return;

    setIsEndingSession(true);
    setError("");

    try {
      await endPracticeSession(token, activeSession.id, sessionNotes);

      setSessionNotes("");
      await fetchDashboardData(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsEndingSession(false);
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
      .catch((err) => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken("");
        setCurrentUser(null);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!token) return;
    fetchDashboardData(token);
  }, [token]);

  useEffect(() => {
    if (!currentUser) return;
    setActiveView("dashboard");
  }, [currentUser?.role]);

  function renderDashboard() {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case "teacher":
        return <TeacherDashboard activeView={activeView} token={token} />;

      case "admin":
        return (
          <AdminDashboard
            activeView={activeView}
            token={token}
            currentUser={currentUser}
          />
        );

      default:
        return (
          <StudentDashboard
            activeView={activeView}
            activeSession={activeSession}
            sessionNotes={sessionNotes}
            isEndingSession={isEndingSession}
            isStartingSession={isStartingSession}
            isTaskActionPending={Boolean(taskActionId)}
            isClearingCurrentTask={isClearingCurrentTask}
            tasks={tasks}
            sessions={sessions}
            deletingTaskId={deletingTaskId}
            taskActionId={taskActionId}
            taskStatusActionId={taskStatusActionId}
            isCreatingTask={isCreatingTask}
            onCreateTask={handleCreateTask}
            onEndSession={handleEndSession}
            onSessionNotesChange={(e) => setSessionNotes(e.target.value)}
            onDeleteTask={handleDeleteTask}
            onStartSession={handleStartSession}
            onPracticeTask={handlePracticeTask}
            onClearCurrentTask={handleClearCurrentTask}
            onTaskStatusChange={handleTaskStatusChange}
            token={token}
          />
        );
    }
  }

  return (
    <main className="app-container">
      {error && <p className="app-error">{error}</p>}
      {!token ? (
        <>
          <div className="auth-header">
            <h1>Practice Tracker</h1>
            <p>Track tasks, sessions, and progress.</p>
          </div>

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
        </>
      ) : (
        <AppShell
          currentUser={currentUser}
          onLogout={handleLogout}
          activeView={activeView}
          onViewChange={setActiveView}
        >
          {loading ? (
            <p className="loading-message">Loading dashboard...</p>
          ) : (
            renderDashboard()
          )}
        </AppShell>
      )}
    </main>
  );
}

export default App;
