import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { createTask, getAllProjects, getAllUsers } from "../api/api";

export default function CreateTask() {
  const { token, signin, role } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    project_id: "",
    title: "",
    description: "",
    status: "pending",
    assigned_to: "",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!signin) return <Navigate to="/login" />;
  if (role === "member") return <Navigate to="/dashboard" />;

  useEffect(() => {
    getAllProjects(token).then(d => setProjects(d.data || [])).catch(console.error);
    getAllUsers(token).then(d => {
      setMembers((d.data || []).filter(u => u.role === "member"));
    }).catch(console.error);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        project_id: parseInt(form.project_id),
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
        due_date: form.due_date || null,
      };
      await createTask(payload, token);
      navigate("/tasks");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 flex items-start justify-center">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <button onClick={() => navigate("/tasks")} className="text-gray-400 hover:text-white text-sm mb-3 transition-colors">
              ← Back to Tasks
            </button>
            <h1 className="text-2xl font-bold text-white">Create Task</h1>
            <p className="text-gray-400 text-sm mt-1">An email notification will be sent to the assignee</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 block mb-1">Project <span className="text-red-400">*</span></label>
                <select
                  required
                  value={form.project_id}
                  onChange={e => setForm({ ...form, project_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a project</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.project_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Task Title <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design landing page"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Description</label>
                <textarea
                  placeholder="Task details..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={e => setForm({ ...form, due_date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-300 block mb-1">Assign To</label>
                <select
                  value={form.assigned_to}
                  onChange={e => setForm({ ...form, assigned_to: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-colors"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}