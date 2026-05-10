import { useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "../components/Sidebar";
import { getAllUsers, deleteUser } from "../api/api";
import { Trash2, Pencil, UserCircle } from "lucide-react";

const roleColors = {
  admin: "bg-red-500/20 text-red-400",
  project_manager: "bg-indigo-500/20 text-indigo-400",
  member: "bg-green-500/20 text-green-400",
};

export default function AllUsers() {
  const { token, signin, role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  if (!signin) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/dashboard" />;

  useEffect(() => {
    getAllUsers(token)
      .then(d => setUsers(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This action cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteUser(id, token);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.message);
    }
    setDeleting(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">All Users</h1>
            <p className="text-gray-400 text-sm mt-1">{users.length} registered users</p>
          </div>
          <Link to="/register">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              + New User
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading users...</p>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-left">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Joined</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-700/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role] || "bg-gray-600 text-gray-300"}`}>
                        {u.role?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/update-user/${u.id}`)}
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id, u.name)}
                          disabled={deleting === u.id}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <p className="text-center text-gray-500 py-10">No users found</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}