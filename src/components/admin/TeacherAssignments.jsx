import { useEffect, useState } from "react";
import {
  getAdminUsers,
  getTeacherStudentLinks,
  createTeacherStudentLink,
  deleteTeacherStudentLink,
} from "../../services/api";

export default function TeacherAssignments({ token }) {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [createAssignmentError, setCreateAssignmentError] = useState("");
  const [createAssignmentSuccess, setCreateAssignmentSuccess] = useState("");
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);
  const [deleteAssignmentError, setDeleteAssignmentError] = useState("");
  const [deleteAssignmentSuccess, setDeleteAssignmentSuccess] = useState("");
  const selectedAssignmentAlreadyExists = links.some(
    (link) =>
      link.teacher_id === Number(selectedTeacherId) &&
      link.student_id === Number(selectedStudentId),
  );

  function getUserEmail(userId) {
    const user = users.find((user) => user.id === userId);
    return user?.email || "Unknown user";
  }

  async function handleCreateAssignment() {
    if (!selectedTeacherId || !selectedStudentId) return;

    setIsCreatingAssignment(true);
    setCreateAssignmentError("");
    setCreateAssignmentSuccess("");
    setDeleteAssignmentError("");
    setDeleteAssignmentSuccess("");

    try {
      await createTeacherStudentLink(
        token,
        Number(selectedTeacherId),
        Number(selectedStudentId),
      );

      setSelectedTeacherId("");
      setSelectedStudentId("");
      setCreateAssignmentSuccess(
        "Teacher assignment was created successfully.",
      );

      await fetchAssignmentData();
    } catch (err) {
      setCreateAssignmentError(err.message);
    } finally {
      setIsCreatingAssignment(false);
    }
  }

  async function handleDeleteAssignment(linkId) {
    setDeletingAssignmentId(linkId);
    setDeleteAssignmentError("");
    setDeleteAssignmentSuccess("");
    setCreateAssignmentError("");
    setCreateAssignmentSuccess("");

    try {
      await deleteTeacherStudentLink(token, linkId);

      setDeleteAssignmentSuccess(
        "Teacher assignment was removed successfully.",
      );

      await fetchAssignmentData();
    } catch (err) {
      setDeleteAssignmentError(err.message);
    } finally {
      setDeletingAssignmentId(null);
    }
  }

  async function fetchAssignmentData() {
    if (!token) return;

    setIsLoading(true);
    setAssignmentsError("");

    try {
      const [usersData, linksData] = await Promise.all([
        getAdminUsers(token),
        getTeacherStudentLinks(token),
      ]);

      setUsers(usersData);
      setLinks(linksData);
    } catch (err) {
      setAssignmentsError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAssignmentData();
  }, [token]);

  const teachers = users.filter(
    (user) => user.role === "teacher" && user.is_active,
  );

  const students = users.filter(
    (user) => user.role === "student" && user.is_active,
  );

  return (
    <div className="teacher-assignments">
      <button type="button" onClick={fetchAssignmentData} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refresh assignments"}
      </button>

      {isLoading && <p className="loading-message">Loading assignments...</p>}

      {assignmentsError && (
        <div className="empty-state">
          <h3>Could not load teacher assignments</h3>
          <p>{assignmentsError}</p>
        </div>
      )}

      {!isLoading && !assignmentsError && (
        <>
          <div className="empty-state">
            <h3>Assignment data loaded</h3>
            <p>
              Found {teachers.length} active teacher
              {teachers.length === 1 ? "" : "s"} and {students.length} active
              student{students.length === 1 ? "" : "s"}.
            </p>
            <p>Current assignments: {links.length}</p>
          </div>

          <div className="teacher-assignments__form">
            <h4>Assign student to teacher</h4>

            <div className="teacher-assignments__controls">
              <label>
                Teacher
                <select
                  value={selectedTeacherId}
                  onChange={(e) => {
                    setSelectedTeacherId(e.target.value);
                    setCreateAssignmentError("");
                    setCreateAssignmentSuccess("");
                    setDeleteAssignmentError("");
                    setDeleteAssignmentSuccess("");
                  }}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.email}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Student
                <select
                  value={selectedStudentId}
                  onChange={(e) => {
                    setSelectedStudentId(e.target.value);
                    setCreateAssignmentError("");
                    setCreateAssignmentSuccess("");
                    setDeleteAssignmentError("");
                    setDeleteAssignmentSuccess("");
                  }}
                >
                  <option value="">Select a student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.email}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={handleCreateAssignment}
                disabled={
                  !selectedTeacherId ||
                  !selectedStudentId ||
                  selectedAssignmentAlreadyExists ||
                  isCreatingAssignment
                }
              >
                {isCreatingAssignment ? "Assigning..." : "Assign student"}
              </button>
            </div>

            {selectedAssignmentAlreadyExists && (
              <p className="loading-message">
                This student is already assigned to the selected teacher.
              </p>
            )}

            {createAssignmentError && (
              <div className="empty-state">
                <h3>Could not create assignment</h3>
                <p>{createAssignmentError}</p>
              </div>
            )}

            {createAssignmentSuccess && (
              <div className="success-message">
                <h5>Assignment created</h5>
                <p>{createAssignmentSuccess}</p>
              </div>
            )}

            {deleteAssignmentError && (
              <div className="empty-state">
                <h3>Could not remove assignment</h3>
                <p>{deleteAssignmentError}</p>
              </div>
            )}

            {deleteAssignmentSuccess && (
              <div className="success-message">
                <h5>Assignment removed</h5>
                <p>{deleteAssignmentSuccess}</p>
              </div>
            )}
          </div>

          <div className="teacher-assignments__list">
            <h4>Current assignments</h4>

            {links.length === 0 ? (
              <div className="empty-state">
                <h3>No assignments yet</h3>
                <p>
                  Teacher-student assignments will appear here once they have
                  been created.
                </p>
              </div>
            ) : (
              <ul className="admin-user-list">
                {links.map((link) => {
                  const isDeletingThisAssignment =
                    deletingAssignmentId === link.id;

                  return (
                    <li key={link.id} className="admin-user-card">
                      <div>
                        <h3>{getUserEmail(link.teacher_id)}</h3>
                        <p>can view and support</p>
                        <h3>{getUserEmail(link.student_id)}</h3>
                      </div>

                      <div className="admin-user-card__status">
                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(link.id)}
                          disabled={deletingAssignmentId !== null}
                        >
                          {isDeletingThisAssignment ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
