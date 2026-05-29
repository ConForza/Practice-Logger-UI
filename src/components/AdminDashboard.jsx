export default function AdminDashboard({ currentUser, onLogout }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>

        <p>Role: {currentUser?.role}</p>

        <button onClick={onLogout}>Logout</button>
      </div>

      <p>Admin features coming soon.</p>
    </div>
  );
}
