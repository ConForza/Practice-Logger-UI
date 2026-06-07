export default function UserList({ users, updatingUserId, onRoleChange }) {
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
            <label className="admin-user-card__role">
              Role
              <select
                value={user.role}
                onChange={(e) => onRoleChange(user.id, e.target.value)}
                disabled={updatingUserId === user.id}
              >
                <option value="student">student</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>
            </label>
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
