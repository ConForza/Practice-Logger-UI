export default function Navbar({ currentUser, onLogout }) {
  return (
    <header className="navbar">
      <div>
        <p className="navbar__eyebrow">Practice Tracker</p>
        <h1 className="navbar__title">Dashboard</h1>
      </div>

      <div className="navbar__actions">
        {currentUser && (
          <p className="navbar__role">Signed in as {currentUser.role}</p>
        )}

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
