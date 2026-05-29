import Navbar from "./Navbar";

export default function AppShell({ children, currentUser, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main className="app-shell__main">{children}</main>
    </div>
  );
}
