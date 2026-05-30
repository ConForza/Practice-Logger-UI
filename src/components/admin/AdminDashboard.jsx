export default function AdminDashboard({ activeView }) {
  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Manage users, roles, and account status.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h3>{activeView}</h3>
        <p>Admin {activeView} features coming soon.</p>
      </section>
    </div>
  );
}
