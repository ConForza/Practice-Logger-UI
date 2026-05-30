import { useState } from "react";

export default function TaskForm({ onCreateTask, isSubmitting }) {
  const [taskData, setTaskData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (taskData.title.trim() === "" || taskData.description.trim() === "") {
      setError("Title and description cannot be empty");
      return;
    }

    setError("");
    try {
      await onCreateTask(taskData);
      setTaskData({ title: "", description: "" });
    } catch {}
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        type="text"
        placeholder="Title"
        value={taskData.title}
        onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={taskData.description}
        onChange={(e) =>
          setTaskData({ ...taskData, description: e.target.value })
        }
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}
