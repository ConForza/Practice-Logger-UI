import { useState, useEffect } from "react";
import {
  assignTaskToStudent,
  getTeacherStudents,
  getTeacherStudentSessions,
} from "../../services/api";
import StudentList from "./StudentList";
import StudentSessionList from "./StudentSessionList";

const TEACHER_VIEW_COPY = {
  dashboard: {
    title: "Teacher Dashboard",
    description: "Review student progress and assign practice work.",
    cardTitle: "Teacher overview",
    cardText:
      "Use the Students view to review practice history and assign tasks. The Assignments view will later provide a wider overview of assigned work.",
  },
  students: {
    title: "Students",
    description: "View students, review practice history, and assign tasks.",
    cardTitle: "Student management",
    cardText:
      "Select a student to review their completed practice sessions and assign new practice tasks.",
  },
  assignments: {
    title: "Assignments",
    description: "Review and manage assigned practice work.",
    cardTitle: "Assignments overview coming soon",
    cardText:
      "This view will eventually show assigned tasks across all students, including pending, in-progress, and completed work.",
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
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [assignmentError, setAssignmentError] = useState("");
  const [assignmentSuccess, setAssignmentSuccess] = useState("");
  const [recentlyAssignedTask, setRecentlyAssignedTask] = useState(null);

  const isAssignmentFormValid =
    assignmentTitle.trim().length > 0 &&
    assignmentDescription.trim().length > 0;
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

  async function handleAssignTask(e) {
    e.preventDefault();

    if (!selectedStudent) return;

    if (!isAssignmentFormValid) {
      setAssignmentError("Please enter a task title and description.");
      return;
    }

    setIsAssigningTask(true);
    setAssignmentError("");
    setAssignmentSuccess("");

    try {
      const assignedTask = await assignTaskToStudent(
        token,
        selectedStudent.id,
        {
          title: assignmentTitle.trim(),
          description: assignmentDescription.trim(),
        },
      );

      setRecentlyAssignedTask(assignedTask);
      setAssignmentTitle("");
      setAssignmentDescription("");
      setAssignmentSuccess(
        `Task assigned successfully. "${assignedTask.title}" will now appear in ${selectedStudent.email}'s task list.`,
      );
    } catch (err) {
      setAssignmentError(err.message);
    } finally {
      setIsAssigningTask(false);
    }
  }

  useEffect(() => {
    if (activeView !== "students") return;
    if (!token) return;

    fetchStudents();
  }, [activeView, token]);

  useEffect(() => {
    setAssignmentTitle("");
    setAssignmentDescription("");
    setAssignmentError("");
    setAssignmentSuccess("");
    setRecentlyAssignedTask(null);

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

                {recentlyAssignedTask && (
                  <div className="recently-assigned-card">
                    <p className="recently-assigned-card__eyebrow">
                      Recently assigned
                    </p>
                    <h4>{recentlyAssignedTask.title}</h4>

                    {recentlyAssignedTask.description && (
                      <p>{recentlyAssignedTask.description}</p>
                    )}

                    {recentlyAssignedTask.status && (
                      <span className="status-badge status-pending">
                        {recentlyAssignedTask.status}
                      </span>
                    )}
                  </div>
                )}

                <form
                  className="teacher-assignment-form"
                  onSubmit={handleAssignTask}
                >
                  <h4>Assign a practice task</h4>

                  <p className="teacher-assignment-form__helper">
                    This task will appear in the selected student's task list.
                  </p>

                  {assignmentError && (
                    <div className="empty-state">
                      <h3>Could not assign task</h3>
                      <p>{assignmentError}</p>
                    </div>
                  )}

                  {assignmentSuccess && (
                    <div className="success-message">
                      <h5>Task assigned</h5>
                      <p>{assignmentSuccess}</p>
                    </div>
                  )}

                  <label>
                    Task title
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => {
                        setAssignmentTitle(e.target.value);
                        setAssignmentError("");
                        setAssignmentSuccess("");
                      }}
                      required
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={assignmentDescription}
                      onChange={(e) => {
                        setAssignmentDescription(e.target.value);
                        setAssignmentError("");
                        setAssignmentSuccess("");
                      }}
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={isAssigningTask || !isAssignmentFormValid}
                  >
                    {isAssigningTask ? "Assigning..." : "Assign task"}
                  </button>
                </form>
              </aside>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
