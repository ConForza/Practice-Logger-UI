function getStatusLabel(status) {
  return status === "completed" ? "Completed" : "Open";
}

function getStatusClass(status) {
  return status === "completed"
    ? "status-badge status-completed"
    : "status-badge status-open";
}

function TaskCard({
  task,
  activeSession,
  onDeleteTask,
  deletingTaskId,
  onPracticeTask,
  taskActionId,
  taskStatusActionId,
  onTaskStatusChange,
}) {
  const isTeacherAssigned = task.teacher_student_link_id !== null;
  const isCurrentTask = activeSession?.current_task_id === task.id;
  const isCompleted = task.status === "completed";
  const isTaskActionInProgress = taskActionId === task.id;
  const isStatusActionInProgress = taskStatusActionId === task.id;

  return (
    <li className="task-card">
      <div className="task-card__heading">
        <h3>{task.title}</h3>
        <span className={getStatusClass(task.status)}>
          {getStatusLabel(task.status)}
        </span>
      </div>

      {isTeacherAssigned && (
        <span className="task-card__assigned-label">
          Assigned by your teacher
        </span>
      )}

      {task.description && <p>{task.description}</p>}

      <div className="task-actions">
        <button
          type="button"
          onClick={() => onPracticeTask(task.id)}
          disabled={isCompleted || isTaskActionInProgress}
        >
          {isTaskActionInProgress
            ? "Selecting..."
            : isCompleted
              ? "Completed"
              : isCurrentTask
                ? "Practising this task"
                : activeSession
                  ? "Switch to this task"
                  : "Practise this"}
        </button>

        <button
          type="button"
          onClick={() =>
            onTaskStatusChange(task.id, isCompleted ? "open" : "completed")
          }
          disabled={isStatusActionInProgress}
        >
          {isStatusActionInProgress
            ? "Updating..."
            : isCompleted
              ? "Reopen task"
              : "Mark complete"}
        </button>

        <button
          type="button"
          onClick={() => onDeleteTask(task.id)}
          disabled={deletingTaskId === task.id || Boolean(activeSession)}
        >
          {deletingTaskId === task.id
            ? "Deleting..."
            : activeSession
              ? "Locked during session"
              : "Delete"}
        </button>
      </div>
    </li>
  );
}

function TaskGroup({
  heading,
  tasks,
  activeSession,
  onDeleteTask,
  deletingTaskId,
  onPracticeTask,
  taskActionId,
  taskStatusActionId,
  onTaskStatusChange,
}) {
  if (tasks.length === 0) return null;

  return (
    <section className="task-group">
      <h2 className="task-list__header">{heading}</h2>
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            activeSession={activeSession}
            onDeleteTask={onDeleteTask}
            deletingTaskId={deletingTaskId}
            onPracticeTask={onPracticeTask}
            taskActionId={taskActionId}
            taskStatusActionId={taskStatusActionId}
            onTaskStatusChange={onTaskStatusChange}
          />
        ))}
      </ul>
    </section>
  );
}

export default function TaskList({
  tasks,
  onDeleteTask,
  deletingTaskId,
  onPracticeTask,
  taskActionId,
  taskStatusActionId,
  onTaskStatusChange,
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

  const openTasks = tasks
    .filter((task) => task.status !== "completed")
    .sort((a, b) => b.id - a.id);
  const completedTasks = tasks
    .filter((task) => task.status === "completed")
    .sort((a, b) => b.id - a.id);

  return (
    <>
      <TaskGroup
        heading="Open tasks"
        tasks={openTasks}
        activeSession={activeSession}
        onDeleteTask={onDeleteTask}
        deletingTaskId={deletingTaskId}
        onPracticeTask={onPracticeTask}
        taskActionId={taskActionId}
        taskStatusActionId={taskStatusActionId}
        onTaskStatusChange={onTaskStatusChange}
      />
      <TaskGroup
        heading="Completed tasks"
        tasks={completedTasks}
        activeSession={activeSession}
        onDeleteTask={onDeleteTask}
        deletingTaskId={deletingTaskId}
        onPracticeTask={onPracticeTask}
        taskActionId={taskActionId}
        taskStatusActionId={taskStatusActionId}
        onTaskStatusChange={onTaskStatusChange}
      />
    </>
  );
}
