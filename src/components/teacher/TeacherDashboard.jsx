import { useState, useEffect } from "react";
import {
  getTeacherStudents,
  getTeacherStudentSessions,
} from "../../services/api";
import StudentList from "./StudentList";
import StudentSessionList from "./StudentSessionList";

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
  const [selectedStudentSessions, setSelectedStudentSessions] = useState([]);
  const [isLoadingStudentSessions, setIsLoadingStudentSessions] =
    useState(false);
  const [studentSessionsError, setStudentSessionsError] = useState("");

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

  async function fetchSelectedStudentSessions(studentId) {
    if (!token || !studentId) return;

    setIsLoadingStudentSessions(true);
    setStudentSessionsError("");

    try {
      const sessionsData = await getTeacherStudentSessions(token, studentId);
      setSelectedStudentSessions(sessionsData);
    } catch (err) {
      setStudentSessionsError(err.message);
    } finally {
      setIsLoadingStudentSessions(false);
    }
  }

  useEffect(() => {
    if (activeView !== "students") return;
    if (!token) return;

    fetchStudents();
  }, [activeView, token]);

  useEffect(() => {
    if (!selectedStudent) {
      setSelectedStudentSessions([]);
      setStudentSessionsError("");
      return;
    }

    fetchSelectedStudentSessions(selectedStudent.id);
  }, [selectedStudent, token]);

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
                <p>Review this student's completed practice sessions below.</p>

                <div className="selected-student-panel__actions">
                  <button
                    type="button"
                    onClick={() =>
                      fetchSelectedStudentSessions(selectedStudent.id)
                    }
                    disabled={isLoadingStudentSessions}
                  >
                    {isLoadingStudentSessions
                      ? "Refreshing..."
                      : "Refresh sessions"}
                  </button>
                </div>

                {isLoadingStudentSessions && (
                  <p className="loading-message">Loading student sessions...</p>
                )}

                {studentSessionsError && (
                  <div className="empty-state">
                    <h3>Could not load student sessions</h3>
                    <p>{studentSessionsError}</p>
                    <button
                      type="button"
                      onClick={() =>
                        fetchSelectedStudentSessions(selectedStudent.id)
                      }
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!isLoadingStudentSessions && !studentSessionsError && (
                  <>
                    <p className="selected-student-panel__summary">
                      {selectedStudentSessions.length} completed practice
                      session
                      {selectedStudentSessions.length === 1 ? "" : "s"}
                    </p>

                    <StudentSessionList sessions={selectedStudentSessions} />
                  </>
                )}
              </aside>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
