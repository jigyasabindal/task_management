import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";

export default function Register() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "team_member"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User created successfully!");
        navigate("/allusers");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800">Create User</h2>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Full Name</label>
            <input type="text" name="name" onChange={handleChange} required
              placeholder="Full name" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Email</label>
            <input type="email" name="email" onChange={handleChange} required
              placeholder="Email address" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Password</label>
            <input type="password" name="password" onChange={handleChange} required
              placeholder="Password" className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Role</label>
            <select name="role" onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-white">
              <option value="team_member">Team Member</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}