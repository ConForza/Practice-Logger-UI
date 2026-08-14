import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function TaskSection({
  tasks,
  activeSession,
  deletingTaskId,
  taskActionId,
  taskStatusActionId,
  isCreatingTask,
  onCreateTask,
  onDeleteTask,
  onPracticeTask,
  onTaskStatusChange,
}) {
  return (
    <section className="task-section">
      <TaskForm onCreateTask={onCreateTask} isSubmitting={isCreatingTask} />

      <TaskList
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        deletingTaskId={deletingTaskId}
        onPracticeTask={onPracticeTask}
        taskActionId={taskActionId}
        taskStatusActionId={taskStatusActionId}
        onTaskStatusChange={onTaskStatusChange}
        activeSession={activeSession}
      />
    </section>
  );
}
