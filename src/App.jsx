import { useEffect, useState } from "react";
import { login, getTasks, createTask } from "./services/api";

import "./App.css";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(null);
  const [tasks, setTasks] = useState([]);

  const [isCreatingTask, setIsCreatingTask] = useState(false);

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
          <TaskList tasks={tasks} />
        </div>
      )}
    </main>
  );
}

export default App;
