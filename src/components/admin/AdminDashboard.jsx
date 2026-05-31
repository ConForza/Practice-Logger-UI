const ADMIN_VIEW_COPY = {
  dashboard: {
    title: "Admin Dashboard",
    description: "Manage users, roles, and account status.",
    cardTitle: "Admin features coming soon",
    cardText:
      "Soon you will be able to manage users, update roles, and deactivate accounts.",
  },
  users: {
    title: "Users",
    description: "View and manage user accounts.",
    cardTitle: "User management coming soon",
    cardText:
      "This view will let admins review users and update account details.",
  },
  settings: {
    title: "Settings",
    description: "Configure application-level settings.",
    cardTitle: "Settings coming soon",
    cardText: "This view will eventually contain administrative app settings.",
  },
};

export default function AdminDashboard({ activeView }) {
  const viewCopy = ADMIN_VIEW_COPY[activeView] || ADMIN_VIEW_COPY.dashboard;

  return (
    <div className="dashboard-page admin-dashboard">
      <div className="dashboard-page__header">
        <div>
          <h2>{viewCopy.title}</h2>
          <p>{viewCopy.description}</p>
        </div>
      </div>

      <section className="dashboard-card">
        <h3>{viewCopy.cardTitle}</h3>
        <p>{viewCopy.cardText}</p>
      </section>
    </div>
  );
}
