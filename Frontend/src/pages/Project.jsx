import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllProjects, createProject, deleteProject } from "../api/api";
import { Trash2, FolderKanban, Plus, X } from "lucide-react";

const ProjectCard = ({ project, onDelete, isAdmin }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete project "${project.project_name}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(project.id);
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 hover:border-indigo-500/50 transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-xl">
            <FolderKanban size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{project.project_name}</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Created by {project.creator?.name || "Unknown"}
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      {project.description && (
        <p className="text-gray-400 text-sm mt-3 leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between">
        <span className="text-gray-500 text-xs">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/tasks`} className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors">
          View Tasks →
        </Link>
      </div>
    </div>
  );
};

export default function Project() {
  const { token, signin, role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    getAllProjects(token)
      .then(d => setProjects(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      await createProject(form, token);
      const d = await getAllProjects(token);
      setProjects(d.data || []);
      setForm({ name: "", description: "" });
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
    setCreating(false);
  };

  const handleDelete = async (id) => {
    await deleteProject(id, token);
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-gray-400 text-sm mt-1">{projects.length} projects</p>
          </div>
          {role === "admin" && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "New Project"}
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-6">
            <h2 className="text-white font-semibold mb-4">Create New Project</h2>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Project name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                type="submit"
                disabled={creating}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                {creating ? "Creating..." : "Create Project"}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Loading projects...</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                onDelete={handleDelete}
                isAdmin={role === "admin"}
              />
            ))}
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <FolderKanban size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No projects yet</p>
            {role === "admin" && (
              <button onClick={() => setShowForm(true)} className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
                Create your first project →
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}