import { NavLink } from "react-router-dom";

const menus = {
  user: [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Bookings", path: "/user/bookings" },
    { label: "Book Service", path: "/user/book" },
    { label: "Profile", path: "/user/profile" }
  ],
  caregiver: [
    { label: "Dashboard", path: "/caregiver/dashboard" },
    { label: "Requests", path: "/caregiver/requests" },
    { label: "My Jobs", path: "/caregiver/jobs" },
    { label: "Profile", path: "/caregiver/profile" }
  ],
  admin: [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Caregivers", path: "/admin/caregivers" },
    { label: "Users", path: "/admin/users" },
    { label: "Contacts", path: "/admin/contacts" }
  ]
};

const Sidebar = () => {
  const role = localStorage.getItem("role");
  const items = menus[role] || [];

  return (
    <aside className="w-64 bg-white border-r min-h-screen px-4 py-6">
      <h1 className="text-xl font-semibold text-blue-600 mb-8">
        ElderCare
      </h1>

      <nav className="space-y-1">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm ${isActive
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-slate-600 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;