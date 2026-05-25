import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import SessionList from "./SessionList";

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

      {activeSession && (
        <section className="active-session">
          <h2>Active Session</h2>
          <p>Task: {activeSession.title}</p>
          <p>Task ID: {activeSession.task_id}</p>

          <textarea
            placeholder="Session notes..."
            value={sessionNotes}
            onChange={onSessionNotesChange}
          />

          <button onClick={onEndSession} disabled={isEndingSession}>
            {isEndingSession ? "Ending Session..." : "End Session"}
          </button>
        </section>
      )}

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
