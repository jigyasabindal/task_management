import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllTasks, getAllUsers, updateTask, deleteTask } from "../api/api";
import { Trash2, CheckSquare, Clock, Loader, ChevronRight, Pencil, X } from "lucide-react";

const statusConfig = {
  pending:     { label: "Pending",     color: "bg-gray-600 text-gray-300",      icon: Clock },
  in_progress: { label: "In Progress", color: "bg-amber-500/20 text-amber-400", icon: Loader },
  completed:   { label: "Completed",   color: "bg-green-500/20 text-green-400", icon: CheckSquare },
};

// ── Edit Task Modal ───────────────────────────────────────────────
function EditTaskModal({ task, token, role, onSave, onClose }) {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    title:       task.title || "",
    description: task.description || "",
    status:      task.status || "pending",
    due_date:    task.due_date ? task.due_date.slice(0, 10) : "",
    assigned_to: task.assigned_to || "",
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");

  const canEditAll = role === "admin" || role === "project_manager";

  useEffect(() => {
    if (canEditAll) {
      getAllUsers(token)
        .then(d => setMembers((d.data || []).filter(u => u.role === "member")))
        .catch(console.error);
    }
  }, [token, canEditAll]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        status:      form.status,
        due_date:    form.due_date || null,
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      };
      await updateTask(task.id, payload, token);
      onSave(task.id, payload);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg">Edit Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Title — admin/manager only */}
          {canEditAll && (
            <div>
              <label className="text-sm text-gray-300 block mb-1">Title</label>
              <input type="text" required value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Description — admin/manager only */}
          {canEditAll && (
            <div>
              <label className="text-sm text-gray-300 block mb-1">Description</label>
              <textarea value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          )}

          {/* Status — everyone can update */}
          <div>
            <label className="text-sm text-gray-300 block mb-1">Status</label>
            <select value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Due date — admin/manager only */}
          {canEditAll && (
            <div>
              <label className="text-sm text-gray-300 block mb-1">Due Date</label>
              <input type="date" value={form.due_date}
                onChange={e => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Reassign — admin/manager only */}
          {canEditAll && (
            <div>
              <label className="text-sm text-gray-300 block mb-1">Assign To</label>
              <select value={form.assigned_to}
                onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Unassigned</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-300 hover:bg-gray-600 text-sm font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Task Card ─────────────────────────────────────────────────────
const TaskCard = ({ task, onDelete, onStatusChange, onEdit, canDelete, canEdit }) => {
  const [updating, setUpdating] = useState(false);
  const token = localStorage.getItem("token");
  const cfg  = statusConfig[task.status] || statusConfig.pending;
  const Icon = cfg.icon;

  const cycleStatus = async () => {
    const order = ["pending", "in_progress", "completed"];
    const next  = order[(order.indexOf(task.status) + 1) % order.length];
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

        {/* Action buttons — appear on hover */}
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
          {canEdit && (
            <button onClick={() => onEdit(task)}
              className="p-1.5 text-gray-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
              title="Edit task">
              <Pencil size={13} />
            </button>
          )}
          {canDelete && (
            <button onClick={handleDelete}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Delete task">
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-gray-400 text-xs mb-3 line-clamp-2 leading-relaxed">{task.description}</p>
      )}

      <div className="flex items-center justify-between text-xs mb-3">
        <span className="text-gray-500">{task.Project?.project_name || "No project"}</span>
        {task.assignee && <span className="text-gray-400">{task.assignee.name}</span>}
      </div>

      {task.due_date && (
        <p className={`text-xs mb-3 ${overdue ? "text-red-400" : "text-gray-500"}`}>
          {overdue ? "⚠ Overdue · " : "Due: "}
          {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center gap-2">
        <button onClick={cycleStatus} disabled={updating}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer hover:opacity-80 ${cfg.color}`}
          title="Click to cycle status">
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

// ── Main Page ─────────────────────────────────────────────────────
export default function Task() {
  const { token, signin, role } = useAuth();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    getAllTasks(token)
      .then(d => setTasks(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const canDelete = role === "project_manager" || role === "admin";
  const canEdit   = true; // everyone can open edit (modal restricts fields by role)
  const filtered  = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  const handleEditSave = (id, payload) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, ...payload } : t
      )
    );
    setEditingTask(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">

        {/* Edit modal */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            token={token}
            role={role}
            onSave={handleEditSave}
            onClose={() => setEditingTask(null)}
          />
        )}

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
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:text-white border border-gray-700"
              }`}
            >
              {f === "all"
                ? `All (${tasks.length})`
                : `${f.replace("_", " ")} (${tasks.filter(t => t.status === f).length})`}
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
                canEdit={canEdit}
                onEdit={setEditingTask}
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
            <p className="text-gray-500">
              No {filter !== "all" ? filter.replace("_", " ") : ""} tasks found
            </p>
          </div>
        )}
      </main>
    </div>
  );
}