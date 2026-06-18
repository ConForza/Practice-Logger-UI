import { useState, useEffect } from "react";
import {
  assignTaskToStudent,
  getTeacherStudents,
  getTeacherStudentSessions,
  getWeeklyStudentProgress,
} from "../../services/api";
import StudentList from "./StudentList";
import StudentSessionList from "./StudentSessionList";
import WeeklyProgressList from "./WeeklyProgressList";
import AccountSettings from "../account/AccountSettings";

const TEACHER_VIEW_COPY = {
  dashboard: {
    title: "Teacher Dashboard",
    description: "Review student progress and manage practice work.",
    cardTitle: "Teacher overview",
    cardText:
      "Use the Students view to review student practice history and assign new tasks.",
  },
  students: {
    title: "Students",
    description: "View students, review practice history, and assign tasks.",
    cardTitle: "Student management",
    cardText:
      "Select a student to review completed practice sessions and assign practice work.",
  },
  assignments: {
    title: "Assignments",
    description: "Review and manage assigned practice work.",
    cardTitle: "Assignments",
    cardText:
      "Review assigned practice tasks, their status, and manage task details.",
  },
  settings: {
    title: "Settings",
    description: "Configure your account and application settings.",
    cardTitle: "Settings",
    cardText: "Manage your account, security, and application settings.",
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
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [isLoadingWeeklyProgress, setIsLoadingWeeklyProgress] = useState(false);
  const [weeklyProgressError, setWeeklyProgressError] = useState("");

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

  async function fetchWeeklyProgress() {
    if (!token) return;

    setIsLoadingWeeklyProgress(true);
    setWeeklyProgressError("");

    try {
      const progressData = await getWeeklyStudentProgress(token);
      setWeeklyProgress(progressData);
    } catch (err) {
      setWeeklyProgressError(err.message);
    } finally {
      setIsLoadingWeeklyProgress(false);
    }
  }

  useEffect(() => {
    if (activeView !== "students") return;
    if (!token) return;

    fetchStudents();
  }, [activeView, token]);

  useEffect(() => {
    if (activeView !== "dashboard") return;

    fetchWeeklyProgress();
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

        {activeView === "dashboard" && (
          <div className="weekly-progress-section">
            <div className="weekly-progress-section__header">
              <div>
                <h3>Weekly student progress</h3>
                <p>Students ranked by completed practice duration this week.</p>
              </div>

              <button
                type="button"
                onClick={fetchWeeklyProgress}
                disabled={isLoadingWeeklyProgress}
              >
                {isLoadingWeeklyProgress ? "Refreshing..." : "Refresh progress"}
              </button>
            </div>

            {isLoadingWeeklyProgress && (
              <p className="loading-message">Loading weekly progress...</p>
            )}

            {weeklyProgressError && (
              <div className="empty-state">
                <h3>Could not load weekly progress</h3>
                <p>{weeklyProgressError}</p>
                <button type="button" onClick={fetchWeeklyProgress}>
                  Try again
                </button>
              </div>
            )}

            {!isLoadingWeeklyProgress && !weeklyProgressError && (
              <WeeklyProgressList progress={weeklyProgress} />
            )}
          </div>
        )}

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
        {activeView === "settings" && <AccountSettings token={token} />}
      </section>
    </div>
  );
}
