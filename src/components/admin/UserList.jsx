export default function UserList({
  users,
  currentUser,
  updatingUserId,
  isUpdatingUser,
  onRoleChange,
  onStatusChange,
  passwordInputs,
  updatingPasswordUserId,
  isUpdatingPassword,
  onPasswordInputChange,
  onPasswordReset,
}) {
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
      {users.map((user) => {
        const isCurrentUser = currentUser?.id === user.id;
        const isPasswordUpdating = updatingPasswordUserId === user.id;
        return (
          <li
            key={user.id}
            className={
              updatingUserId === user.id
                ? "admin-user-card admin-user-card--updating"
                : "admin-user-card"
            }
          >
            <div>
              <h3>{user.email}</h3>
              <label className="admin-user-card__role">
                Role
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(user.id, e.target.value)}
                  disabled={isUpdatingUser || isCurrentUser}
                >
                  <option value="student">student</option>
                  <option value="teacher">teacher</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              {isCurrentUser && (
                <p className="admin-user-card__note">
                  This is your account. You cannot change your own admin access.
                </p>
              )}

              <div className="admin-user-card__password-reset">
                <label htmlFor={`password-reset-${user.id}`}>
                  Reset password
                </label>

                <div className="admin-user-card__password-controls">
                  <input
                    id={`password-reset-${user.id}`}
                    type="password"
                    value={passwordInputs[user.id] || ""}
                    onChange={(e) =>
                      onPasswordInputChange(user.id, e.target.value)
                    }
                    placeholder="New password"
                    disabled={isUpdatingPassword}
                  />

                  <button
                    type="button"
                    onClick={() => onPasswordReset(user.id)}
                    disabled={isUpdatingPassword}
                  >
                    {isPasswordUpdating ? "Resetting..." : "Reset"}
                  </button>
                </div>
              </div>

              {updatingUserId === user.id && (
                <p className="admin-user-card__updating">
                  Updating this user...
                </p>
              )}
            </div>

            <div className="admin-user-card__status">
              <span
                className={
                  user.is_active
                    ? "status-badge status-completed"
                    : "status-badge status-pending"
                }
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>

              <button
                type="button"
                onClick={() => onStatusChange(user.id, !user.is_active)}
                disabled={isUpdatingUser || isCurrentUser}
              >
                {user.is_active ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
