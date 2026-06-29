import { useEffect, useState } from "react";
import { getAdminUsers, getTeacherStudentLinks } from "../../services/api";

export default function TeacherAssignments({ token }) {
  const [users, setUsers] = useState([]);
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState("");

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
        </>
      )}
    </div>
  );
}
