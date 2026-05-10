import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Sidebar from "./Sidebar";

const CreateTasks = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    project_id: "", title: "", description: "",
    status: "todo", assigned_to: "", due_date: ""
  });

  useEffect(() => {
    fetch("http://localhost:3000/project/my-projects", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.data || []))
      .catch(console.log);

    fetch("http://localhost:3000/project/manager/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.data || []))
      .catch(console.log);
  }, [token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:3000/task/createTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Task created successfully!");
        navigate("/tasks");
      } else {
        alert(data.message || "Failed to create task");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 flex items-center justify-center p-6">
        <form onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-4">

          <h2 className="text-2xl font-bold text-center text-gray-800">Create Task</h2>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Project</label>
            <select name="project_id" value={form.project_id} onChange={handleChange}
              required className="w-full p-2 border rounded-lg bg-white">
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.project_name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="Task title" required className="w-full p-2 border rounded-lg" />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              rows={3} placeholder="Task description"
              className="w-full p-2 border rounded-lg resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-white">
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Due Date</label>
              <input type="date" name="due_date" value={form.due_date}
                onChange={handleChange} required className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Assign To</label>
            <select name="assigned_to" value={form.assigned_to} onChange={handleChange}
              required className="w-full p-2 border rounded-lg bg-white">
              <option value="">Select team member</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            {submitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTasks;