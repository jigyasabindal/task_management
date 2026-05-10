import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Users, FolderKanban, CheckSquare, Bell, Activity } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { getAllUsers, getAllProjects, getAllTasks, getMyLogs } from "../api/api";

const Card = ({ title, value, icon: Icon, color = "indigo" }) => {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-400/10",
    green: "text-green-400 bg-green-400/10",
    amber: "text-amber-400 bg-amber-400/10",
    rose: "text-rose-400 bg-rose-400/10",
  };
  return (
    <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-between hover:border-gray-600 transition-colors">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h2 className="text-3xl font-bold text-white mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={26} />
      </div>
    </div>
  );
};

// ── ADMIN DASHBOARD ───────────────────────────────────────────────
const AdminDashboard = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState(0);
  const [tasks, setTasks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllUsers(token).then(d => setUsers(d.data || [])).catch(() => {}),
      getAllProjects(token).then(d => setProjects(d.data?.length || 0)).catch(() => {}),
      getAllTasks(token).then(d => setTasks(d.data?.length || 0)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [token]);

  const managers = users.filter(u => u.role === "project_manager").length;
  const members = users.filter(u => u.role === "member").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Overview of your entire system</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title="Project Managers" value={managers} icon={Users} color="indigo" />
          <Card title="Team Members" value={members} icon={Users} color="green" />
          <Card title="Total Projects" value={projects} icon={FolderKanban} color="amber" />
          <Card title="Total Tasks" value={tasks} icon={CheckSquare} color="rose" />
        </div>
      )}

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">User Management</h2>
        <div className="flex gap-3 flex-wrap">
          <Link to="/register">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Create User
            </button>
          </Link>
          <Link to="/allusers">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Update User
            </button>
          </Link>
          <Link to="/allusers">
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Delete User
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Project Actions</h2>
          <div className="flex gap-3 flex-wrap">
            <Link to="/projects">
              <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                Manage Projects
              </button>
            </Link>
            <Link to="/tasks">
              <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                All Tasks
              </button>
            </Link>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Monitoring</h2>
          <div className="flex gap-3 flex-wrap">
            <Link to="/activity-logs">
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                Activity Logs
              </button>
            </Link>
            <Link to="/notifications">
              <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                Notifications
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── PROJECT MANAGER DASHBOARD ─────────────────────────────────────
const ManagerDashboard = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllProjects(token).then(d => setProjects(d.data || [])).catch(() => {}),
      getAllTasks(token).then(d => setTasks(d.data || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [token]);

  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Project Manager Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your projects and team tasks</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title="My Projects" value={projects.length} icon={FolderKanban} color="indigo" />
          <Card title="Pending Tasks" value={pending} icon={CheckSquare} color="amber" />
          <Card title="In Progress" value={inProgress} icon={Activity} color="green" />
          <Card title="Completed" value={completed} icon={CheckSquare} color="rose" />
        </div>
      )}

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link to="/create-task">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Create Task
            </button>
          </Link>
          <Link to="/tasks">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              All Tasks
            </button>
          </Link>
          <Link to="/projects">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Projects
            </button>
          </Link>
          <Link to="/notifications">
            <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Notifications
            </button>
          </Link>
        </div>
      </div>

      {projects.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Projects</h2>
          <div className="space-y-2">
            {projects.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <span className="text-white text-sm font-medium">{p.project_name}</span>
                <span className="text-gray-400 text-xs">{p.description?.slice(0, 40) || "No description"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── TEAM MEMBER DASHBOARD ─────────────────────────────────────────
const TeamDashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // member role: getAllTasks filters to only their tasks server-side
    getAllTasks(token)
      .then(d => setTasks(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const pending = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const completed = tasks.filter(t => t.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Track your assigned tasks</p>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card title="Pending" value={pending} icon={CheckSquare} color="amber" />
          <Card title="In Progress" value={inProgress} icon={Activity} color="green" />
          <Card title="Completed" value={completed} icon={CheckSquare} color="indigo" />
        </div>
      )}

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <Link to="/tasks">
            <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              View My Tasks
            </button>
          </Link>
          <Link to="/notifications">
            <button className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
              Notifications
            </button>
          </Link>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">My Tasks</h2>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(t => (
              <Link to={`/task/${t.id}`} key={t.id}>
                <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-white text-sm font-medium">{t.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    t.status === "completed" ? "bg-green-500/20 text-green-400" :
                    t.status === "in_progress" ? "bg-amber-500/20 text-amber-400" :
                    "bg-gray-600 text-gray-300"
                  }`}>
                    {t.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── MAIN DASHBOARD ────────────────────────────────────────────────
export default function Dashboard() {
  const { signin, role } = useAuth();
  if (!signin) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {role === "admin" && <AdminDashboard />}
        {role === "project_manager" && <ManagerDashboard />}
        {role === "member" && <TeamDashboard />}
        {!["admin", "project_manager", "member"].includes(role) && (
          <div className="text-red-400">Unknown role: {role}. Please logout and login again.</div>
        )}
      </main>
    </div>
  );
}