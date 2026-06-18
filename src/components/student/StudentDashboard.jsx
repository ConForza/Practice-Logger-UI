import TaskSection from "./TaskSection";
import SessionHistorySection from "./SessionHistorySection";
import ActiveSessionPanel from "./ActiveSessionPanel";

const STUDENT_VIEW_COPY = {
  dashboard: {
    title: "Student Dashboard",
    description: "Manage your practice tasks and session history.",
  },
  tasks: {
    title: "Practice Tasks",
    description: "Create, review, and start practice tasks.",
  },
  sessions: {
    title: "Practice Sessions",
    description: "Review your completed practice sessions.",
  },
  settings: {
    title: "Account Settings",
    description: "Manage your account settings.",
  },
};

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
  const viewCopy = STUDENT_VIEW_COPY[activeView] || STUDENT_VIEW_COPY.dashboard;

  return (
    <div className="dashboard-page student-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>{viewCopy.title}</h2>
          <p>{viewCopy.description}</p>
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

      {activeView === "settings" && <AccountSettings token={token} />}
    </div>
  );
}
