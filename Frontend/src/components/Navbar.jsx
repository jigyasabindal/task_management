import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Bell } from "lucide-react";

export default function Navbar() {
  const { signin, name, role } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="text-white font-bold text-lg tracking-tight">
        TaskFlowSpirit
      </Link>

      <div className="flex items-center gap-4">
        {signin ? (
          <>
            <Link to="/notifications" className="text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
            </Link>
            <span className="text-gray-300 text-sm">
              {name} <span className="text-gray-500">·</span>{" "}
              <span className="text-indigo-400 capitalize text-xs">{role?.replace("_", " ")}</span>
            </span>
          </>
        ) : (
          <Link to="/login" className="text-gray-300 hover:text-white text-sm transition-colors">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}