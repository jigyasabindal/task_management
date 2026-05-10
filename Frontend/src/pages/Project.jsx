import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProjectCard from "../components/ProjectCard";

const Project = () => {
  const { token, signin, role } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    const url =
      role === "admin"
        ? "http://localhost:3000/project/projects"
        : "http://localhost:3000/project/my-projects";

    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { setProjects(data.data || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [token]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {role === "admin" ? "All Projects" : "My Projects"}
        </h1>

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={(id) => setProjects((prev) => prev.filter((p) => p.id !== id))}
            />
          ))}
        </div>

        {!loading && projects.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No projects found</p>
        )}
      </div>
    </div>
  );
};

export default Project;