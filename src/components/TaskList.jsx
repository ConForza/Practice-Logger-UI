function getStatusLabel(status) {
  switch (status) {
    case "in progress":
      return "In progress";
    case "completed":
      return "Completed";
    default:
      return "Pending";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "in progress":
      return "status-badge status-in-progress";
    case "completed":
      return "status-badge status-completed";
    default:
      return "status-badge status-pending";
  }
}

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
          <p>
            Status:{" "}
            <span className={getStatusClass(task.status)}>
              {getStatusLabel(task.status)}
            </span>
          </p>
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
