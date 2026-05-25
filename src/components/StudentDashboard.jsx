import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import SessionList from "./SessionList";
import ActiveSessionPanel from "./ActiveSessionPanel";

export default function StudentDashboard({
  activeSession,
  sessionNotes,
  isEndingSession,
  tasks,
  sessions,
  deletingTaskId,
  startingTaskId,
  isCreatingTask,
  onCreateTask,
  onEndSession,
  onSessionNotesChange,
  onDeleteTask,
  onStartSession,
}) {
  return (
    <div className="tasks-section">
      <TaskForm onCreateTask={onCreateTask} isSubmitting={isCreatingTask} />

      <ActiveSessionPanel
        activeSession={activeSession}
        sessionNotes={sessionNotes}
        isEndingSession={isEndingSession}
        onSessionNotesChange={onSessionNotesChange}
        onEndSession={onEndSession}
      />

      <TaskList
        tasks={tasks}
        onDeleteTask={onDeleteTask}
        deletingTaskId={deletingTaskId}
        onStartSession={onStartSession}
        startingTaskId={startingTaskId}
        activeSession={activeSession}
      />

      <SessionList sessions={sessions} />
    </div>
  );
}
