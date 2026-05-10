import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";

const UpdateUser = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "", password: "" });

  useEffect(() => {
    fetch(`http://localhost:3000/user/find/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const user = data.data?.[0];
        if (user) setForm({ name: user.name, email: user.email, role: user.role, password: "" });
        setLoading(false);
      })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`http://localhost:3000/user/updateUser/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User updated successfully!");
        navigate("/allusers");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    }
    setUpdating(false);
  };

  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading user...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">

          <h2 className="text-2xl font-bold text-center text-gray-800">Update User</h2>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange}
              className="w-full p-2 border rounded-lg" placeholder="Name" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange}
              className="w-full p-2 border rounded-lg" placeholder="Email" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">New Password</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} className="w-full p-2 border rounded-lg"
              placeholder="Leave blank to keep same" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white">
              <option value="team_member">Team Member</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={updating}
            className="w-full bg-blue-500 text-white py-2 rounded-lg">
            {updating ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;