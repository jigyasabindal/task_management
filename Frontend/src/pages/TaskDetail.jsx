import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { findTask, getComments, addComment, deleteComment, updateTask } from "../api/api";
import { Trash2, Send } from "lucide-react";

export default function TaskDetail() {
  const { id } = useParams();
  const { token, signin, role, id: userId } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    Promise.all([
      findTask(id, token).then(d => setTask(d.data)),
      getComments(id, token).then(d => setComments(d.data || [])),
    ]).catch(console.error).finally(() => setLoading(false));
  }, [id, token]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      // addComment(taskId, body, token) — body field must be "comment" per controller
      await addComment(id, { comment: newComment }, token);
      const d = await getComments(id, token);
      setComments(d.data || []);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (cid) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await deleteComment(cid, token);
      setComments(prev => prev.filter(c => c.id !== cid));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (status) => {
    setStatusUpdating(true);
    try {
      await updateTask(id, { status }, token);
      setTask(prev => ({ ...prev, status }));
    } catch (err) {
      alert(err.message);
    }
    setStatusUpdating(false);
  };

  const statusColor = {
    pending:     "bg-gray-600 text-gray-300",
    in_progress: "bg-amber-500/20 text-amber-400",
    completed:   "bg-green-500/20 text-green-400",
  };

  if (loading) return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8"><p className="text-gray-400">Loading task...</p></main>
    </div>
  );

  if (!task) return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8"><p className="text-red-400">Task not found.</p></main>
    </div>
  );

  const canEdit = role === "admin" || role === "project_manager" || task.assigned_to === parseInt(userId);
  const overdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "completed";

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <button onClick={() => navigate("/tasks")} className="text-gray-400 hover:text-white text-sm mb-5 transition-colors">
          ← Back to Tasks
        </button>

        {/* Task Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 mb-5">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-white leading-tight flex-1 pr-4">{task.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[task.status] || "bg-gray-600 text-gray-300"}`}>
              {task.status?.replace("_", " ")}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-300 text-sm leading-relaxed mb-5">{task.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-gray-700 pt-4">
            <div>
              <p className="text-gray-500 text-xs mb-1">Project</p>
              <p className="text-white">{task.Project?.project_name || "—"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Assigned To</p>
              <p className="text-white">{task.assignee?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Due Date</p>
              <p className={overdue ? "text-red-400 font-medium" : "text-white"}>
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                {overdue && " ⚠ Overdue"}
              </p>
            </div>
          </div>

          {canEdit && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-500 text-xs mb-2">Update Status</p>
              <div className="flex gap-2">
                {["pending", "in_progress", "completed"].map(s => (
                  <button key={s} onClick={() => handleStatusChange(s)}
                    disabled={statusUpdating || task.status === s}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                      task.status === s ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } disabled:opacity-50`}
                  >
                    {s.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Comments ({comments.length})</h2>

          <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
            ) : comments.map(c => (
              <div key={c.id} className="bg-gray-700/50 rounded-xl p-3 group">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {c.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white text-xs font-medium">{c.author?.name}</span>
                    <span className="text-gray-500 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
                  </div>
                  {(c.user_id === parseInt(userId) || role === "admin") && (
                    <button onClick={() => handleDeleteComment(c.id)}
                      className="p-1 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
                <p className="text-gray-300 text-sm pl-8">{c.comment}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleComment} className="flex gap-3">
            <input type="text" value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <button type="submit" disabled={submitting || !newComment.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <Send size={15} />
              {submitting ? "..." : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}