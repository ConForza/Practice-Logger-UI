export default function UserList({ users }) {
  if (users.length === 0) {
    return (
      <div className="empty-state">
        <h3>No users found</h3>
        <p>Registered users will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="admin-user-list">
      {users.map((user) => (
        <li key={user.id} className="admin-user-card">
          <div>
            <h3>{user.email}</h3>
            <p>Role: {user.role}</p>
          </div>

          <span
            className={
              user.is_active
                ? "status-badge status-completed"
                : "status-badge status-pending"
            }
          >
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </li>
      ))}
    </ul>
  );
}
