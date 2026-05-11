import { useEffect, useState } from "react";
import {
  login,
  getTasks,
  createTask,
  deleteTask,
  startSession,
  endSession,
  getSessions,
  getActiveSession,
} from "./services/api";

import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import SessionList from "./components/SessionList";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [activeSession, setActiveSession] = useState(null);
  const [startingTaskId, setStartingTaskId] = useState(null);
  const [sessionNotes, setSessionNotes] = useState("");
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login(email, password);
      setToken(data.access_token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      const session = await startSession(token, taskId);
      setActiveSession(session);
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

      const updatedTasks = await getTasks(token);
      const updatedSessions = await getSessions(token);

      setTasks(updatedTasks);
      setSessions(updatedSessions);

      setActiveSession(null);
      setSessionNotes("");
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

  useEffect(() => {
    if (!token) return;

    async function fetchInitialData() {
      try {
        setError("");
        setLoading(true);

        const tasksData = await getTasks(token);
        setTasks(tasksData);

        const sessionsData = await getSessions(token);
        setSessions(sessionsData);

        const activeSessionData = await getActiveSession(token);
        setActiveSession(activeSessionData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [token]);

  return (
    <main>
      <h1>Practice Tracker</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {!token ? (
        <form onSubmit={handleLogin}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : (
        <div className="tasks-section">
          <TaskForm
            onCreateTask={handleCreateTask}
            isSubmitting={isCreatingTask}
          />
          {activeSession && (
            <section className="active-session">
              <h2>Active Session</h2>
              <p>Task ID: {activeSession.title}</p>
              <p>Task ID: {activeSession.task_id}</p>
              <textarea
                placeholder="Session notes..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
              />
              <button onClick={handleEndSession} disabled={isEndingSession}>
                {isEndingSession ? "Ending Session..." : "End Session"}
              </button>
            </section>
          )}
          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            deletingTaskId={deletingTaskId}
            onStartSession={handleStartSession}
            startingTaskId={startingTaskId}
            activeSession={activeSession}
            onEndSession={handleEndSession}
          />
          <SessionList sessions={sessions} />
        </div>
      )}
    </main>
  );
}

export default App;
