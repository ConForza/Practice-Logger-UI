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
      <h2>Active Session</h2>

      {activeSession.title && <p>Task: {activeSession.title}</p>}
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
  );
}
