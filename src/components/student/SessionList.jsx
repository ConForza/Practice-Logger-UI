function formatSessionDate(startTime) {
  if (!startTime) {
    return "Unknown start time";
  }

  return new Date(startTime).toLocaleString();
}

function getSessionTasks(session) {
  if (session.tasks?.length) {
    return session.tasks;
  }

  if (session.title) {
    return [{ id: session.task_id || "legacy", title: session.title }];
  }

  if (session.task_id) {
    return [{ id: session.task_id, title: `Task ${session.task_id}` }];
  }

  return [];
}

export default function SessionList({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="empty-state">
        <h3>No practice sessions yet</h3>
        <p>Completed sessions will appear here after practice is recorded.</p>
      </div>
    );
  }

  return (
    <ul className="session-list">
      {sessions.map((session) => {
        const sessionTasks = getSessionTasks(session);

        return (
          <li className="session-card" key={session.id}>
            <div className="session-card-header">
              <h3>Practice session</h3>
              <span>{session.duration} minutes</span>
            </div>

            <p className="session-meta">
              Started: {formatSessionDate(session.start_time)}
            </p>

            <div className="session-tasks">
              <h4>Practised</h4>
              {sessionTasks.length > 0 ? (
                <ul>
                  {sessionTasks.map((task) => (
                    <li key={task.id}>{task.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="session-meta">No task selected</p>
              )}
            </div>

            {session.notes ? (
              <div className="session-notes">
                <h4>Notes</h4>
                <p>{session.notes}</p>
              </div>
            ) : (
              <p className="session-meta">No notes added.</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
