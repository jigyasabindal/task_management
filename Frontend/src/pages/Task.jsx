import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllTasks, updateTask, deleteTask } from "../api/api";
import { Trash2, CheckSquare, Clock, Loader, ChevronRight } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-gray-600 text-gray-300", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400", icon: Loader },
  completed: { label: "Completed", color: "bg-green-500/20 text-green-400", icon: CheckSquare },
};

const TaskCard = ({ task, onDelete, onStatusChange, canDelete }) => {
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");
  const cfg = statusConfig[task.status] || statusConfig.pending;
  const Icon = cfg.icon;

  const cycleStatus = async () => {
    const order = ["pending", "in_progress", "completed"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    setUpdating(true);
    try {
      await updateTask(task.id, { status: next }, token);
      onStatusChange(task.id, next);
    } catch (err) {
      alert(err.message);
    }
    setUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    try {
      await deleteTask(task.id, token);
      onDelete(task.id);
    } catch (err) {
      alert(err.message);
    }
  };

  const overdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed";

  return (
    <div className={`bg-gray-800 border rounded-2xl p-5 hover:border-gray-600 transition-colors group ${overdue ? "border-red-500/40" : "border-gray-700"}`}>
      <div className="flex items-start justify-between mb-3">
        <Link to={`/task/${task.id}`} className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-snug hover:text-indigo-400 transition-colors truncate pr-2">
            {task.title}
          </h3>
        </Link>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-gray-500">
          {task.Project?.project_name || "No project"}
        </span>
        {task.assignee && (
          <span className="text-gray-400">{task.assignee.name}</span>
        )}
      </div>

      {task.due_date && (
        <p className={`text-xs mb-3 ${overdue ? "text-red-400" : "text-gray-500"}`}>
          {overdue ? "⚠ Overdue · " : "Due: "}
          {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={cycleStatus}
          disabled={updating}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer hover:opacity-80 ${cfg.color}`}
          title="Click to change status"
        >
          <Icon size={11} />
          {updating ? "..." : cfg.label}
        </button>

        <Link to={`/task/${task.id}`} className="ml-auto text-gray-600 hover:text-gray-400 transition-colors">
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default function Task() {
  const { token, signin, role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    getAllTasks(token)
      .then(d => setTasks(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const canDelete = role === "project_manager" || role === "admin";
  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {role === "member" ? "My Tasks" : "All Tasks"}
            </h1>
            <p className="text-gray-400 text-sm mt-1">{filtered.length} tasks</p>
          </div>
          {(role === "project_manager" || role === "admin") && (
            <Link to="/create-task">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                + Create Task
              </button>
            </Link>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "in_progress", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {f === "all" ? `All (${tasks.length})` : `${f.replace("_", " ")} (${tasks.filter(t => t.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading tasks...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                canDelete={canDelete}
                onDelete={id => setTasks(prev => prev.filter(t => t.id !== id))}
                onStatusChange={(id, status) =>
                  setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
                }
              />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <CheckSquare size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No {filter !== "all" ? filter.replace("_", " ") : ""} tasks found</p>
          </div>
        )}
      </main>
    </div>
  );
}