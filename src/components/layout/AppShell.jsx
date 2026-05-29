import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children, currentUser, onLogout }) {
  return (
    <div className="app-shell">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <div className="app-shell__body">
        <Sidebar currentUser={currentUser} />
        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}
