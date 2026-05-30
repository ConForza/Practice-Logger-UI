export default function TeacherDashboard({ activeView }) {
  return (
    <div className="dashboard-page teacher-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>Teacher Dashboard</h2>
          <p>Review student progress and assign practice work.</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h3>{activeView}</h3>
        <p>Teacher {activeView} features coming soon.</p>
      </section>
    </div>
  );
}
