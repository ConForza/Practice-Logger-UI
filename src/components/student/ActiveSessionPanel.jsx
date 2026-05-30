export default function ActiveSessionPanel({
  activeSession,
  sessionNotes,
  isEndingSession,
  onSessionNotesChange,
  onEndSession,
}) {
  if (!activeSession) {
    return null;
  }

  return (
    <section className="active-session">
      <div className="active-session-header">
        <h2>Practice Session in Progress</h2>
        <p>Keep practising, then add notes before ending the session.</p>
      </div>

      <div className="active-session-task">
        {activeSession.title ? (
          <h3>{activeSession.title}</h3>
        ) : (
          <h3>Task ID: {activeSession.task_id}</h3>
        )}

        {activeSession.title && <p>Task ID: {activeSession.task_id}</p>}
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
          {isEndingSession ? "Ending Session..." : "End Session"}
        </button>
      </div>
    </section>
  );
}
