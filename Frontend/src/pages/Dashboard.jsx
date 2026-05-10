import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Link, Navigate } from "react-router-dom";
import { Users, FolderKanban, CheckSquare, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";

const Card = ({ title, value, icon: Icon }) => (
  <div className="bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-700 flex items-center justify-between">
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-white mt-1">{value}</h2>
    </div>
    <Icon className="text-indigo-400" size={28} />
  </div>
);

const AdminDashboard = () => {
  const { token } = useAuth();
  const [managers, setManagers] = useState(0);
  const [projects, setProjects] = useState(0);
  const [tasks, setTasks] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/user/managers", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setManagers(d.data?.length || 0)).catch(console.log);

    fetch("http://localhost:3000/project/projects", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setProjects(d.data?.length || 0)).catch(console.log);

    fetch("http://localhost:3000/task/tasks", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setTasks(d.data?.length || 0)).catch(console.log);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Total Managers" value={managers} icon={Users} />
        <Card title="Total Projects" value={projects} icon={FolderKanban} />
        <Card title="Total Tasks" value={tasks} icon={CheckSquare} />
      </div>
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/register"><button className="bg-indigo-600 px-4 py-2 rounded-lg text-white">Create User</button></Link>
          <Link to="/allusers"><button className="bg-gray-700 px-4 py-2 rounded-lg text-white">All Users</button></Link>
          <Link to="/projects"><button className="bg-green-600 px-4 py-2 rounded-lg text-white">Projects</button></Link>
        </div>
      </div>
    </div>
  );
};

const ManagerDashboard = () => {
  const { token } = useAuth();
  const [totalProjects, setTotalProjects] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/project/my-projects", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setTotalProjects(d.data?.length || 0)).catch(console.log);

    fetch("http://localhost:3000/project/manager/users", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setTeamMembers(d.data?.length || 0)).catch(console.log);

    fetch("http://localhost:3000/project/tasks-pending", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setPendingTasks(d.data?.length || 0)).catch(console.log);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Project Manager Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="My Projects" value={totalProjects} icon={FolderKanban} />
        <Card title="Team Members" value={teamMembers} icon={Users} />
        <Card title="Pending Tasks" value={pendingTasks} icon={CheckSquare} />
      </div>
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4 flex-wrap">
          <Link to="/create-task"><button className="bg-green-600 px-4 py-2 rounded-lg text-white">Create Task</button></Link>
          <Link to="/tasks"><button className="bg-gray-700 px-4 py-2 rounded-lg text-white">All Tasks</button></Link>
          <Link to="/projects"><button className="bg-indigo-600 px-4 py-2 rounded-lg text-white">My Projects</button></Link>
        </div>
      </div>
    </div>
  );
};

const TeamDashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState(0);
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/task/findTasks", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        setTasks(d.totalTasks || 0);
        setPending(d.pendingTasks || 0);
        setCompleted(d.completedTasks || 0);
      }).catch(console.log);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Team Member Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="My Tasks" value={tasks} icon={CheckSquare} />
        <Card title="Pending" value={pending} icon={FolderKanban} />
        <Card title="Completed" value={completed} icon={Users} />
      </div>
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link to="/tasks"><button className="bg-indigo-600 px-4 py-2 rounded-lg text-white">View My Tasks</button></Link>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { signin, role } = useAuth();

  if (!signin) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        {role === "admin" && <AdminDashboard />}
        {role === "project_manager" && <ManagerDashboard />}
        {role === "team_member" && <TeamDashboard />}
      </main>
    </div>
  );
}