const NAV_ITEMS_BY_ROLE = {
  student: [
    { label: "Dashboard", value: "dashboard" },
    { label: "Tasks", value: "tasks" },
    { label: "Sessions", value: "sessions" },
    { label: "Settings", value: "settings" },
  ],
  teacher: [
    { label: "Dashboard", value: "dashboard" },
    { label: "Students", value: "students" },
    { label: "Assignments", value: "assignments" },
    { label: "Settings", value: "settings" },
  ],
  admin: [
    { label: "Dashboard", value: "dashboard" },
    { label: "Users", value: "users" },
    { label: "Teacher Assignments", value: "teacher-assignments" },
    { label: "Settings", value: "settings" },
  ],
};

export default function Sidebar({ currentUser, activeView, onViewChange }) {
  const role = currentUser?.role || "student";
  const navItems = NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.student;

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <nav>
        <ul className="sidebar__list">
          {navItems.map((item) => (
            <li key={item.value}>
              <button
                type="button"
                className={
                  activeView === item.value
                    ? "sidebar__item sidebar__item--active"
                    : "sidebar__item"
                }
                onClick={() => onViewChange(item.value)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
