export default function TaskList({
  tasks,
  onDeleteTask,
  onStartSession,
  deletingTaskId,
  startingTaskId,
  activeSession,
}) {
  if (!tasks || tasks.length === 0) {
    return <p>No tasks found.</p>;
  }

  return (
    <ul>
      {tasks.toReversed().map((task) => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <button
            onClick={() => onDeleteTask(task.id)}
            disabled={deletingTaskId === task.id || Boolean(activeSession)}
          >
            {deletingTaskId === task.id ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => onStartSession(task.id)}
            disabled={
              startingTaskId === task.id ||
              Boolean(activeSession) ||
              task.status === "completed"
            }
          >
            {startingTaskId === task.id ? "Starting..." : "Start Session"}
          </button>
        </li>
      ))}
    </ul>
  );
}
