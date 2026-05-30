import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function TaskSection({
  tasks,
  activeSession,
  deletingTaskId,
  startingTaskId,
  isCreatingTask,
  onCreateTask,
  onDeleteTask,
  onStartSession,
}) {
  return (
    <section className="task-section">
      <TaskForm onCreateTask={onCreateTask} isSubmitting={isCreatingTask} />

      <TaskList
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        deletingTaskId={deletingTaskId}
        onStartSession={onStartSession}
        startingTaskId={startingTaskId}
        activeSession={activeSession}
      />
    </section>
  );
}
