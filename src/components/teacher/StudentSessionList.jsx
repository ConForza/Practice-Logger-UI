export default function StudentSessionList({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No completed sessions yet</h3>
        <p>This student&apos;s completed practice sessions will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="teacher-session-list">
      {sessions.map((session) => (
        <li key={session.id} className="teacher-session-card">
          <div className="teacher-session-card__header">
            <h4>Practice session</h4>
            <span>{session.duration} min</span>
          </div>

          <p className="teacher-session-card__meta">
            Started: {new Date(session.start_time).toLocaleString()}
          </p>

          <p className="teacher-session-card__meta">
            Task ID: {session.task_id}
          </p>

          {session.notes ? (
            <div className="teacher-session-card__notes">
              <h5>Notes</h5>
              <p>{session.notes}</p>
            </div>
          ) : (
            <p className="teacher-session-card__meta">No notes added.</p>
          )}
        </li>
      ))}
    </ul>
  );
}
