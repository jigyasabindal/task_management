import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { findUser, updateUser } from "../api/api";

export default function UpdateUser() {
  const { token, signin, role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", role: "member", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    findUser(id, token)
      .then(d => {
        const u = d.data;
        setForm({ name: u.name, email: u.email, role: u.role, password: "" });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = { name: form.name, email: form.email, role: form.role };
    if (form.password) payload.password = form.password;
    try {
      await updateUser(id, payload, token);
      setSuccess("User updated successfully!");
      setTimeout(() => navigate("/allusers"), 1500);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 flex items-start justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <button onClick={() => navigate("/allusers")} className="text-gray-400 hover:text-white text-sm mb-3 flex items-center gap-1 transition-colors">
              ← Back to Users
            </button>
            <h1 className="text-2xl font-bold text-white">Update User</h1>
          </div>

          {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm">{success}</div>}

          {loading ? (
            <p className="text-gray-400">Loading user...</p>
          ) : (
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">New Password <span className="text-gray-500">(leave blank to keep current)</span></label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                {role === "admin" && (
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">Role</label>
                    <select
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="member">Team Member</option>
                      <option value="project_manager">Project Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-colors"
                >
                  {saving ? "Saving..." : "Update User"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}