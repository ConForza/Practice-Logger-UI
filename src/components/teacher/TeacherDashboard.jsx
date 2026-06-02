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
    description: "View students and review their practice activity.",
    cardTitle: "Student list coming soon",
    cardText:
      "This view will show students connected to your teaching dashboard.",
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
          <StudentList students={students} />
        )}
      </section>
    </div>
  );
}
