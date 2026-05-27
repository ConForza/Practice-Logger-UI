function formatSessionDate(startTime) {
  if (!startTime) {
    return "Unknown start time";
  }

  return new Date(startTime).toLocaleString();
}

export default function SessionList({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <section className="session-history">
        <h2>Session History</h2>
        <p className="empty-state">
          No practice sessions yet. Completed sessions will appear here.
        </p>
      </section>
    );
  }

  return (
    <section className="session-history">
      <h2>Session History</h2>

      <ul className="session-list">
        {sessions.map((session) => (
          <li className="session-card" key={session.id}>
            <div className="session-card-header">
              <h3>{session.title || `Task ${session.task_id}`}</h3>
              <span>{session.duration} mins</span>
            </div>

            <p className="session-meta">
              Started: {formatSessionDate(session.start_time)}
            </p>

            <p className="session-meta">Task ID: {session.task_id}</p>

            {session.notes ? (
              <div className="session-notes">
                <h4>Notes</h4>
                <p>{session.notes}</p>
              </div>
            ) : (
              <p className="session-meta">No notes added.</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
