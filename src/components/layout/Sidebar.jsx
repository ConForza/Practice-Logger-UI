const NAV_ITEMS_BY_ROLE = {
  student: ["Dashboard", "Tasks", "Sessions"],
  teacher: ["Dashboard", "Students", "Assignments"],
  admin: ["Dashboard", "Users", "Settings"],
};

export default function Sidebar({ currentUser }) {
  const role = currentUser?.role || "student";
  const navItems = NAV_ITEMS_BY_ROLE[role] || NAV_ITEMS_BY_ROLE.student;

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <nav>
        <ul className="sidebar__list">
          {navItems.map((item) => (
            <li key={item}>
              <button type="button" className="sidebar__item">
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
