import { useState } from "react";
import { changeCurrentUserPassword } from "../../services/api";

export default function ChangePasswordForm({ token }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setIsUpdating(true);

      await changeCurrentUserPassword(token, currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess("Password changed successfully.");
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <form className="change-password-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="current-password">Current password</label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="new-password">New password</label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">Confirm new password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={isUpdating}>
        {isUpdating ? "Changing..." : "Change password"}
      </button>

      {passwordError && (
        <div className="empty-state">
          <h3>Could not change password</h3>
          <p>{passwordError}</p>
        </div>
      )}

      {passwordSuccess && (
        <div className="success-message">
          <h5>Password changed</h5>
          <p>{passwordSuccess}</p>
        </div>
      )}
    </form>
  );
}
