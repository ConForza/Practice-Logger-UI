import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AppShell({
  children,
  currentUser,
  onLogout,
  activeView,
  onViewChange,
}) {
  return (
    <div className="app-shell">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      <div className="app-shell__body">
        <Sidebar
          currentUser={currentUser}
          activeView={activeView}
          onViewChange={onViewChange}
        />
        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}
