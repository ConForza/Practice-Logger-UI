export default function TeacherDashboard({ currentUser, onLogout }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Teacher Dashboard</h2>

        <p>Role: {currentUser?.role}</p>

        <button onClick={onLogout}>Logout</button>
      </div>

      <p>Teacher features coming soon.</p>
    </div>
  );
}
