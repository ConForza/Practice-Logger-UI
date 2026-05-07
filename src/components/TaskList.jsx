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
      {tasks.map((task) => (
        <li key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <button
            onClick={() => onDeleteTask(task.id)}
            disabled={deletingTaskId === task.id}
          >
            {deletingTaskId === task.id ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => onStartSession(task.id)}
            disabled={startingTaskId === task.id || Boolean(activeSession)}
          >
            {startingTaskId === task.id ? "Starting..." : "Start Session"}
          </button>
        </li>
      ))}
    </ul>
  );
}
