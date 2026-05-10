import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project, onDelete }) => {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      const res = await fetch(
        `http://localhost:3000/project/deleteProject/${project.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        onDelete(project.id);
      } else {
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">

      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        {project.project_name || project.title || "Untitled"}
      </h2>

      <p className="text-sm text-gray-500 mb-4">
        {project.description || "No description provided"}
      </p>

      <div className="text-xs text-gray-400 space-y-1 mb-4">
        <p>📅 Created: {project.created_at?.slice(0, 10) || "N/A"}</p>
        <p>👤 Created by: {project.created_by || "N/A"}</p>
        <p>👥 Assigned to: {project.assigned_to || "N/A"}</p>
      </div>

      <div className="flex gap-2">
        {role === "admin" && (
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

export default ProjectCard;