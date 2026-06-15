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

function getStartButtonText(task, startingTaskId, activeSession) {
  if (startingTaskId === task.id) {
    return "Starting...";
  }

  if (task.status === "completed") {
    return "Completed";
  }

  if (activeSession) {
    return "Session in progress";
  }

  return "Start Session";
}

function isStartButtonDisabled(task, startingTaskId, activeSession) {
  return (
    startingTaskId === task.id ||
    Boolean(activeSession) ||
    task.status === "completed"
  );
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
    return (
      <div className="empty-state">
        <h3>No practice tasks yet</h3>
        <p>Create your first practice task to start tracking your work.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="task-list__header">Recent Tasks</h2>
      <ul className="task-list">
        {tasks.toReversed().map((task) => (
          <li className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Status:{" "}
              <span className={getStatusClass(task.status)}>
                {getStatusLabel(task.status)}
              </span>
            </p>
            <div className="task-actions">
              <button
                onClick={() => onDeleteTask(task.id)}
                disabled={deletingTaskId === task.id || Boolean(activeSession)}
              >
                {deletingTaskId === task.id
                  ? "Deleting..."
                  : activeSession
                    ? "Locked during session"
                    : "Delete"}
              </button>
              <button
                onClick={() => onStartSession(task.id)}
                disabled={isStartButtonDisabled(
                  task,
                  startingTaskId,
                  activeSession,
                )}
              >
                {getStartButtonText(task, startingTaskId, activeSession)}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
