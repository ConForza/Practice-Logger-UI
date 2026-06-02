import { useState, useEffect } from "react";
import { getTeacherStudents } from "../../services/api";
import StudentList from "./StudentList";

const TEACHER_VIEW_COPY = {
  dashboard: {
    title: "Teacher Dashboard",
    description: "Review student progress and assign practice work.",
    cardTitle: "Teacher features coming soon",
    cardText:
      "Soon you will be able to view students, inspect practice history, and assign tasks.",
  },
  students: {
    title: "Students",
    description: "View registered student users.",
    cardTitle: "Student list",
    cardText:
      "These are the student accounts currently available to your teacher dashboard.",
  },
  assignments: {
    title: "Assignments",
    description: "Create and review assigned practice tasks.",
    cardTitle: "Assignments coming soon",
    cardText:
      "This view will let you assign practice work to selected students.",
  },
};

export default function TeacherDashboard({ activeView, token }) {
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const viewCopy = TEACHER_VIEW_COPY[activeView] || TEACHER_VIEW_COPY.dashboard;

  async function fetchStudents() {
    setIsLoadingStudents(true);
    setStudentsError("");

    try {
      const studentsData = await getTeacherStudents(token);
      setStudents(studentsData);
    } catch (err) {
      setStudentsError(err.message);
    } finally {
      setIsLoadingStudents(false);
    }
  }

  useEffect(() => {
    if (activeView !== "students") return;
    if (!token) return;

    fetchStudents();
  }, [activeView, token]);

  return (
    <div className="dashboard-page teacher-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>{viewCopy.title}</h2>
          <p>{viewCopy.description}</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h3>{viewCopy.cardTitle}</h3>
        <p>{viewCopy.cardText}</p>

        {activeView === "students" && (
          <div className="teacher-student-actions">
            <button
              type="button"
              onClick={fetchStudents}
              disabled={isLoadingStudents}
            >
              {isLoadingStudents ? "Refreshing..." : "Refresh students"}
            </button>
          </div>
        )}

        {isLoadingStudents && <p>Loading students...</p>}
        {studentsError && (
          <div className="empty-state">
            <h3>Could not load students</h3>

            <p>{studentsError}</p>

            <button type="button" onClick={fetchStudents}>
              Try again
            </button>
          </div>
        )}

        {activeView === "students" && !isLoadingStudents && !studentsError && (
          <div className="teacher-students-layout">
            <StudentList
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={setSelectedStudent}
            />

            {selectedStudent && (
              <aside className="selected-student-panel">
                <p className="selected-student-panel__eyebrow">
                  Selected student
                </p>
                <h3>{selectedStudent.email}</h3>
                <p>
                  You can review this student&apos;s practice history in the
                  next step.
                </p>
              </aside>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
