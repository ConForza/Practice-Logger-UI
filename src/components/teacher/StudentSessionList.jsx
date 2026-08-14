export default function StudentSessionList({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No completed sessions yet</h3>
        <p>This student&apos;s completed practice sessions will appear here.</p>
      </div>
    );
  }

  function getSessionTasks(session) {
    if (session.tasks?.length) return session.tasks;
    if (session.title) {
      return [{ id: session.task_id || "legacy", title: session.title }];
    }
    if (session.task_id) {
      return [{ id: session.task_id, title: `Task ${session.task_id}` }];
    }
    return [];
  }

  return (
    <ul className="teacher-session-list">
      {sessions.map((session) => {
        const sessionTasks = getSessionTasks(session);

        return (
          <li key={session.id} className="teacher-session-card">
            <div className="teacher-session-card__header">
              <h4>Practice session</h4>
              <span>{session.duration} min</span>
            </div>

            <p className="teacher-session-card__meta">
              Started: {new Date(session.start_time).toLocaleString()}
            </p>

            <div className="teacher-session-card__tasks">
              <h5>Practised</h5>
              {sessionTasks.length > 0 ? (
                <ul>
                  {sessionTasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="teacher-session-card__meta">No task selected</p>
              )}
            </div>

            {session.notes ? (
              <div className="teacher-session-card__notes">
                <h5>Notes</h5>
                <p>{session.notes}</p>
              </div>
            ) : (
              <p className="teacher-session-card__meta">No notes added.</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
