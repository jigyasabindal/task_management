import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { registerUser, publicSignup } from "../api/api";

const API = "http://localhost:3000";

export default function Register() {
  const { token, role, login } = useAuth();
  const navigate = useNavigate();
  const isAdmin = token && role === "admin";

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); setSuccess("");
    try {
      if (isAdmin) {
        // Admin creates user with any role → POST /user/createUser
        await registerUser(form, token);
        setSuccess(`User "${form.name}" created successfully!`);
        setForm({ name: "", email: "", password: "", role: "member" });
      } else {
        // Public signup → POST /user/register (role forced to "member" by backend)
        const data = await publicSignup({ name: form.name, email: form.email, password: form.password });
        if (data.token && data.user) {
          login(data.token, data.user.name, data.user.role, data.user.id);
          navigate("/dashboard");
        } else {
          setSuccess("Account created! Redirecting to login...");
          setTimeout(() => navigate("/login"), 1500);
        }
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    }
    setLoading(false);
  };

  if (isAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <main className="flex-1 p-8 flex items-start justify-center">
          <div className="w-full max-w-md">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">Register New User</h1>
              <p className="text-gray-400 text-sm mt-1">Admin only · assign any role</p>
            </div>
            {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm">{error}</div>}
            {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm">{success}</div>}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Password</label>
                  <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Minimum 6 characters"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Role</label>
                  <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="member">Team Member</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold transition-colors">
                  {loading ? "Registering..." : "Register User"}
                </button>
              </form>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              <Link to="/allusers" className="text-indigo-400 hover:text-indigo-300">← View all users</Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-300 mt-2 text-sm">Sign up to get started</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm text-center">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-xl text-green-300 text-sm text-center">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-2">Full Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-2">Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-colors">
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}