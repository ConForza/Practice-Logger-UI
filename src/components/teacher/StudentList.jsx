export default function StudentList({
  students,
  selectedStudent,
  onSelectStudent,
}) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <h3>No students found</h3>
        <p>Student users will appear here once they have registered.</p>
      </div>
    );
  }

  return (
    <ul className="teacher-student-list">
      {students.map((student) => (
        <li key={student.id}>
          <button
            type="button"
            className={
              selectedStudent?.id === student.id
                ? "teacher-student-card teacher-student-card--selected"
                : "teacher-student-card"
            }
            onClick={() => onSelectStudent(student)}
          >
            <div>
              <h3>{student.email}</h3>
              <p>Role: {student.role}</p>
            </div>

            <span
              className={
                student.is_active
                  ? "status-badge status-completed"
                  : "status-badge status-pending"
              }
            >
              {student.is_active ? "Active" : "Inactive"}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
