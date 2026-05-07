import { useEffect, useState } from "react";
import {
  login,
  getTasks,
  createTask,
  deleteTask,
  startSession,
} from "./services/api";

import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const [activeSession, setActiveSession] = useState(null);
  const [startingTaskId, setStartingTaskId] = useState(null);

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

  useEffect(() => {
    if (!token) return;

    async function fetchTasks() {
      try {
        setError("");
        setLoading(true);

        const data = await getTasks(token);

        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
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
            <div className="active-session">
              <p>Active session started for task ID: {activeSession.task_id}</p>
            </div>
          )}
          <TaskList
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            deletingTaskId={deletingTaskId}
            onStartSession={handleStartSession}
            startingTaskId={startingTaskId}
            activeSession={activeSession}
          />
        </div>
      )}
    </main>
  );
}

export default App;
