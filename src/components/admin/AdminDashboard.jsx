import { useEffect, useState } from "react";
import {
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
} from "../../services/api";
import UserList from "./UserList";

const ADMIN_VIEW_COPY = {
  dashboard: {
    title: "Admin Dashboard",
    description: "Manage users, roles, and account status.",
    cardTitle: "Admin overview",
    cardText:
      "Use the Users view to review accounts, update roles, and manage account status.",
  },
  users: {
    title: "Users",
    description: "View and manage user accounts.",
    cardTitle: "User accounts",
    cardText:
      "Review registered users, update roles, and activate or deactivate accounts.",
  },
  settings: {
    title: "Settings",
    description: "Configure application-level settings.",
    cardTitle: "Settings coming soon",
    cardText:
      "This view will later contain account, security, and application settings.",
  },
};

export default function AdminDashboard({ activeView, token, currentUser }) {
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [roleUpdateError, setRoleUpdateError] = useState("");
  const [roleUpdateSuccess, setRoleUpdateSuccess] = useState("");
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState("");

  const viewCopy = ADMIN_VIEW_COPY[activeView] || ADMIN_VIEW_COPY.dashboard;
  const isUpdatingUser = updatingUserId !== null;

  async function fetchUsers() {
    if (!token) return;

    setIsLoadingUsers(true);
    setUsersError("");

    try {
      const usersData = await getAdminUsers(token);
      setUsers(usersData);
    } catch (err) {
      setUsersError(err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  async function handleRoleChange(userId, newRole) {
    setUpdatingUserId(userId);
    setRoleUpdateError("");
    setRoleUpdateSuccess("");
    setStatusUpdateError("");
    setStatusUpdateSuccess("");

    try {
      const updatedUser = await updateUserRole(token, userId, newRole);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );

      setRoleUpdateSuccess(
        `${updatedUser.email}'s role was updated to ${updatedUser.role}.`,
      );
    } catch (err) {
      setRoleUpdateError(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  async function handleStatusChange(userId, isActive) {
    setUpdatingUserId(userId);
    setStatusUpdateError("");
    setStatusUpdateSuccess("");
    setRoleUpdateError("");
    setRoleUpdateSuccess("");

    try {
      const updatedUser = await updateUserStatus(token, userId, isActive);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user,
        ),
      );

      setStatusUpdateSuccess(
        `${updatedUser.email}'s account was ${
          updatedUser.is_active ? "reactivated" : "deactivated"
        }.`,
      );
    } catch (err) {
      setStatusUpdateError(err.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  useEffect(() => {
    if (activeView !== "users") return;

    fetchUsers();
  }, [activeView, token]);

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

        {activeView === "users" && (
          <>
            <button
              type="button"
              onClick={fetchUsers}
              disabled={isLoadingUsers}
            >
              {isLoadingUsers ? "Refreshing..." : "Refresh users"}
            </button>

            {isLoadingUsers && (
              <p className="loading-message">Loading users...</p>
            )}

            {usersError && (
              <div className="empty-state">
                <h3>Could not load users</h3>
                <p>{usersError}</p>
                <button type="button" onClick={fetchUsers}>
                  Try again
                </button>
              </div>
            )}

            {roleUpdateError && (
              <div className="empty-state">
                <h3>Could not update role</h3>
                <p>{roleUpdateError}</p>
              </div>
            )}

            {roleUpdateSuccess && (
              <div className="success-message">
                <h5>Role updated</h5>
                <p>{roleUpdateSuccess}</p>
              </div>
            )}

            {statusUpdateError && (
              <div className="empty-state">
                <h3>Could not update status</h3>
                <p>{statusUpdateError}</p>
              </div>
            )}

            {statusUpdateSuccess && (
              <div className="success-message">
                <h5>Status updated</h5>
                <p>{statusUpdateSuccess}</p>
              </div>
            )}

            {!isLoadingUsers && !usersError && (
              <UserList
                users={users}
                currentUser={currentUser}
                updatingUserId={updatingUserId}
                isUpdatingUser={isUpdatingUser}
                onRoleChange={handleRoleChange}
                onStatusChange={handleStatusChange}
              />
            )}
          </>
        )}
      </section>
    </div>
  );
}
