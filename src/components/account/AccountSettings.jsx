import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountSettings({ token }) {
  return (
    <div className="account-settings">
      <h3>Account settings</h3>
      <p>Change your password for this Practice Logger account.</p>
      <ChangePasswordForm token={token} />
    </div>
  );
}
