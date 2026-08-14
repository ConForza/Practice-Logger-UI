import TaskSection from "./TaskSection";
import SessionHistorySection from "./SessionHistorySection";
import ActiveSessionPanel from "./ActiveSessionPanel";
import AccountSettings from "../account/AccountSettings";

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
  isStartingSession,
  isTaskActionPending,
  isClearingCurrentTask,
  tasks,
  sessions,
  deletingTaskId,
  taskActionId,
  taskStatusActionId,
  isCreatingTask,
  onCreateTask,
  onEndSession,
  onSessionNotesChange,
  onDeleteTask,
  onStartSession,
  onPracticeTask,
  onClearCurrentTask,
  onTaskStatusChange,
  token,
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
            isStartingSession={isStartingSession}
            isTaskActionPending={isTaskActionPending}
            isClearingCurrentTask={isClearingCurrentTask}
            tasks={tasks}
            onSessionNotesChange={onSessionNotesChange}
            onEndSession={onEndSession}
            onStartSession={onStartSession}
            onSelectTask={onPracticeTask}
            onClearCurrentTask={onClearCurrentTask}
          />

          <TaskSection
            tasks={tasks}
            activeSession={activeSession}
            deletingTaskId={deletingTaskId}
            taskActionId={taskActionId}
            taskStatusActionId={taskStatusActionId}
            isCreatingTask={isCreatingTask}
            onCreateTask={onCreateTask}
            onDeleteTask={onDeleteTask}
            onPracticeTask={onPracticeTask}
            onTaskStatusChange={onTaskStatusChange}
          />

          <SessionHistorySection sessions={sessions} />
        </>
      )}

      {activeView === "tasks" && (
        <TaskSection
          tasks={tasks}
          activeSession={activeSession}
          deletingTaskId={deletingTaskId}
          taskActionId={taskActionId}
          taskStatusActionId={taskStatusActionId}
          isCreatingTask={isCreatingTask}
          onCreateTask={onCreateTask}
          onDeleteTask={onDeleteTask}
          onPracticeTask={onPracticeTask}
          onTaskStatusChange={onTaskStatusChange}
        />
      )}

      {activeView === "sessions" && (
        <SessionHistorySection sessions={sessions} />
      )}

      {activeView === "settings" && <AccountSettings token={token} />}
    </div>
  );
}
