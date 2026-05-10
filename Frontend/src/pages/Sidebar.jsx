import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { logout, name, role } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col justify-between min-h-screen">
      <div>
        <p className="text-gray-400 text-xs uppercase mb-4 tracking-widest">Menu</p>
        <nav className="space-y-1">

          <button
            onClick={() => navigate("/dashboard")}
            className="block w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Dashboard
          </button>

          {role === "admin" && (
            <button
              onClick={() => navigate("/allusers")}
              className="block w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              All Users
            </button>
          )}

          {(role === "admin" || role === "project_manager") && (
            <button
              onClick={() => navigate("/projects")}
              className="block w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Projects
            </button>
          )}

          <button
            onClick={() => navigate("/tasks")}
            className="block w-full text-left p-2 hover:bg-gray-700 rounded"
          >
            Tasks
          </button>

          {role === "project_manager" && (
            <button
              onClick={() => navigate("/create-task")}
              className="block w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Create Task
            </button>
          )}

          {role === "admin" && (
            <button
              onClick={() => navigate("/register")}
              className="block w-full text-left p-2 hover:bg-gray-700 rounded"
            >
              Create User
            </button>
          )}

        </nav>
      </div>

      <div className="bg-gray-800 p-3 rounded-xl">
        <p className="text-sm text-gray-400">Logged in as</p>
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-gray-400 capitalize mb-2">
          {role?.replace(/_/g, " ")}
        </p>
        <button
          onClick={logout}
          className="w-full bg-red-600 py-2 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;