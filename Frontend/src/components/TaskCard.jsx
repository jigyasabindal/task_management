import { useAuth } from "../AuthContext";

const statusStyles = {
  todo: { badge: "bg-gray-100 text-gray-600", label: "Todo" },
  in_progress: { badge: "bg-yellow-100 text-yellow-700", label: "In Progress" },
  completed: { badge: "bg-green-100 text-green-700", label: "Completed" },
};

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const { token, role } = useAuth();
  const style = statusStyles[task.status] || statusStyles.todo;

  const handleStatusUpdate = async () => {
    const next =
      task.status === "todo"
        ? "in_progress"
        : task.status === "in_progress"
        ? "completed"
        : null;

    if (!next) return;

    try {
      const res = await fetch(
        `http://localhost:3000/task/updateTask/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: next }),
        }
      );
      if (res.ok) {
        onStatusChange(task.id, next);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/task/deleteTask/${task.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        onDelete(task.id);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">

      <div className="flex justify-between items-start mb-2">
        <h2 className="text-base font-semibold text-gray-800 flex-1 pr-2">
          {task.title}
        </h2>
        <span className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${style.badge}`}>
          {style.label}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
      )}

      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <p>📅 Due: {task.due_date?.slice(0, 10) || "N/A"}</p>
        <p>👤 Assigned to: {task.assigned_to || "N/A"}</p>
      </div>

      <div className="flex gap-2">
        {task.status !== "completed" && (
          <button
            onClick={handleStatusUpdate}
            className="flex-1 px-3 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600"
          >
            {task.status === "todo" ? "Start Task" : "Mark Done"}
          </button>
        )}

        {(role === "project_manager" || role === "admin") && (
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;