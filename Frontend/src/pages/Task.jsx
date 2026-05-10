import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TaskCard from "../components/TaskCard";

const Task = () => {
  const { token, signin, role } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    const url =
      role === "team_member"
        ? "http://localhost:3000/task/findTasks"
        : "http://localhost:3000/task/tasks";

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { setTasks(data.data || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [token]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {role === "team_member" ? "My Tasks" : "All Tasks"}
          </h1>
          <span className="text-sm text-gray-500">{tasks.length} tasks</span>
        </div>

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
              onStatusChange={(id, newStatus) =>
                setTasks((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
                )
              }
            />
          ))}
        </div>

        {!loading && tasks.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default Task;