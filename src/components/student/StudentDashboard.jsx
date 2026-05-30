import TaskSection from "./TaskSection";
import SessionHistorySection from "./SessionHistorySection";
import ActiveSessionPanel from "./ActiveSessionPanel";

export default function StudentDashboard({
  activeView,
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
    <div className="dashboard-page student-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>Student Dashboard</h2>
          <p>Manage your practice tasks and session history.</p>
        </div>
      </div>

      {activeView === "dashboard" && (
        <>
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
        </>
      )}

      {activeView === "tasks" && (
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
      )}

      {activeView === "sessions" && (
        <SessionHistorySection sessions={sessions} />
      )}
    </div>
  );
}
