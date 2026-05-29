import TaskSection from "./TaskSection";
import SessionHistorySection from "./SessionHistorySection";
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
      <div className="dashboard-header">
        <h2>Student Dashboard</h2>
      </div>

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

      <SessionHistorySection sessions={sessions} />
    </div>
  );
}
