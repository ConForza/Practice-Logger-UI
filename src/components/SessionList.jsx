export default function SessionList({ sessions }) {
  if (!sessions || sessions.length === 0) {
    return (
      <section>
        <h2>Session History</h2>
        <p>No sessions found.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Session History</h2>
      <ul>
        {sessions.map((session) => (
          <li key={session.id}>
            <p>Task ID: {session.task_id}</p>
            <p>Title: {session.title}</p>
            <p>Duration: {session.duration} mins</p>
            {session.notes && <p>Notes: {session.notes}</p>}
            <p>Started At: {new Date(session.start_time).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
