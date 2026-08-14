import { useEffect, useMemo, useState } from "react";

function formatElapsedTime(startedAt, now) {
  if (!startedAt) return "00:00";

  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - new Date(startedAt).getTime()) / 1000),
  );
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function ActiveSessionPanel({
  activeSession,
  sessionNotes,
  isEndingSession,
  isStartingSession,
  isTaskActionPending,
  isClearingCurrentTask,
  tasks,
  onSessionNotesChange,
  onEndSession,
  onStartSession,
  onSelectTask,
  onClearCurrentTask,
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeSession) return undefined;

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [activeSession]);

  const openTasks = useMemo(
    () => (tasks || []).filter((task) => task.status !== "completed"),
    [tasks],
  );

  if (!activeSession) {
    return (
      <section className="active-session active-session--empty">
        <div>
          <p className="active-session__eyebrow">Practice session</p>
          <h2>Ready when you are</h2>
          <p>
            Start the timer first, then choose a task whenever you are ready to
            focus.
          </p>
        </div>
        <button
          type="button"
          className="primary-action"
          onClick={() => onStartSession()}
          disabled={isStartingSession}
        >
          {isStartingSession ? "Starting session..." : "Start practice session"}
        </button>
      </section>
    );
  }

  const currentTask = (activeSession.tasks || []).find(
    (task) => task.id === activeSession.current_task_id,
  );

  return (
    <section className="active-session">
      <div className="active-session-header">
        <div>
          <p className="active-session__eyebrow">Practice session</p>
          <h2>Practice session in progress</h2>
        </div>
        <time className="session-timer" aria-label="Elapsed practice time">
          {formatElapsedTime(activeSession.started_at, now)}
        </time>
      </div>

      <div className="active-session-current">
        <p className="active-session__label">Currently practising</p>
        <h3>{currentTask?.title || "No task selected"}</h3>
        <p>
          {currentTask
            ? "Keep going, or switch tasks whenever it feels useful."
            : "The timer will continue while you decide what to practise next."}
        </p>
      </div>

      <div className="active-session-task-controls">
        <label htmlFor="current-task-select">Choose a task</label>
        <div className="active-session-task-controls__row">
          <select
            id="current-task-select"
            value={activeSession.current_task_id || ""}
            onChange={(event) => {
              if (event.target.value) {
                onSelectTask(Number(event.target.value));
              }
            }}
            disabled={isTaskActionPending || openTasks.length === 0}
          >
            <option value="">Select a task...</option>
            {openTasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          {currentTask && (
            <button
              type="button"
              onClick={onClearCurrentTask}
              disabled={isClearingCurrentTask}
            >
              {isClearingCurrentTask
                ? "Clearing..."
                : "Done with this for now"}
            </button>
          )}
        </div>
      </div>

      <div className="practised-tasks">
        <p className="active-session__label">Practised this session</p>
        {activeSession.tasks?.length ? (
          <ul className="practised-tasks__list">
            {activeSession.tasks.map((task) => (
              <li key={task.id}>
                <span>{task.title}</span>
                <span className={
                  task.status === "completed"
                    ? "status-badge status-completed"
                    : "status-badge status-open"
                }>
                  {task.status === "completed" ? "Completed" : "Open"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="active-session__muted">
            No task selected yet. Your session is already underway.
          </p>
        )}
      </div>

      <div className="session-notes-field">
        <label htmlFor="session-notes">Session notes</label>
        <textarea
          id="session-notes"
          placeholder="What did you practise? What improved? What still needs work?"
          value={sessionNotes}
          onChange={onSessionNotesChange}
        />
        <p className="helper-text">
          These notes will be saved when you end the session.
        </p>
      </div>

      <div className="active-session-actions">
        <button type="button" onClick={onEndSession} disabled={isEndingSession}>
          {isEndingSession ? "Ending session..." : "End practice session"}
        </button>
      </div>
    </section>
  );
}
