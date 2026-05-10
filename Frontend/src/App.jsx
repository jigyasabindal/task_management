import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import UpdateUser from "./pages/UpdateUser";
import Project from "./pages/Project";
import Task from "./pages/Task";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDetail";
import Notifications from "./pages/Notifications";
import ActivityLogs from "./pages/ActivityLogs";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/allusers" element={<AllUsers />} />
          <Route path="/update-user/:id" element={<UpdateUser />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/create-task" element={<CreateTask />} />
          <Route path="/task/:id" element={<TaskDetail />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activity-logs" element={<ActivityLogs />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}