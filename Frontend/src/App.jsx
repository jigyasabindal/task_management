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
import CreateTasks from "./pages/CreateTasks";

import axios from "axios";
import { useEffect } from "react";

export default function App() {

  useEffect(() => {
    axios.get("http://localhost:3000/api/test")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          <Route path="/create-task" element={<CreateTasks />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}