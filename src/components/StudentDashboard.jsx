import TaskSection from "./TaskSection";
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
      <ActiveSessionPanel
        activeSession={activeSession}
        sessionNotes={sessionNotes}
        isEndingSession={isEndingSession}
        onSessionNotesChange={onSessionNotesChange}
        onEndSession={onEndSession}
      />

      <TaskSection
        tasks={tasks}
        activeSession={activeSession}
        deletingTaskId={deletingTaskId}
        startingTaskId={startingTaskId}
        isCreatingTask={isCreatingTask}
        onCreateTask={onCreateTask}
        onDeleteTask={onDeleteTask}
        onStartSession={onStartSession}
      />

      <SessionList sessions={sessions} />
    </div>
  );
}
