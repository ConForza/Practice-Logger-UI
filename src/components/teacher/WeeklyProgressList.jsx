export default function WeeklyProgressList({ progress }) {
  if (progress.length === 0) {
    return (
      <div className="empty-state">
        <h3>No students assigned yet.</h3>
        <p>
          Students assigned by an admin will appear here. Once they record
          practice this week, their activity will be included in this summary.
        </p>
      </div>
    );
  }

  return (
    <ol className="weekly-progress-list">
      {progress.map((student) => (
        <li key={student.student_id} className="weekly-progress-card">
          <div>
            <h4>{student.email}</h4>
            <p>
              {student.session_count} completed session
              {student.session_count === 1 ? "" : "s"}
            </p>
          </div>

          <strong>{student.total_duration} min</strong>
        </li>
      ))}
    </ol>
  );
}
