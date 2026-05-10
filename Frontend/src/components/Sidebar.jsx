import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  Bell, Activity, LogOut, PlusCircle,
} from "lucide-react";

const navItems = {
  admin: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/allusers", icon: Users, label: "Users" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/activity-logs", icon: Activity, label: "Activity Logs" },
  ],
  project_manager: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/projects", icon: FolderKanban, label: "Projects" },
    { to: "/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/create-task", icon: PlusCircle, label: "Create Task" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
    { to: "/activity-logs", icon: Activity, label: "Activity Logs" },
  ],
  member: [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/tasks", icon: CheckSquare, label: "My Tasks" },
    { to: "/notifications", icon: Bell, label: "Notifications" },
  ],
};

export default function Sidebar() {
  const { role, name, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItems[role] || navItems.member;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-800">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Logged in as</p>
        <p className="text-white font-semibold mt-1 truncate">{name}</p>
        <span className="text-xs text-indigo-400 capitalize">{role?.replace("_", " ")}</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}>
                <Icon size={18} />
                {label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}