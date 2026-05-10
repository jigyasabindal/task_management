import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const AllUsers = () => {
  const { token, signin, role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    fetch("http://localhost:3000/user/getUsers", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => { setUsers(data.data || []); setLoading(false); })
      .catch((err) => { console.log(err); setLoading(false); });
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:3000/user/deleteUser/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        alert("Failed to delete user");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">All Users</h1>

        {loading && <p className="text-center text-gray-400">Loading...</p>}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-md p-5">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800">{user.name}</h2>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                {user.role?.replace(/_/g, " ")}
              </span>

              <div className="flex gap-2 mt-4">
                {user.role !== "admin" && (
                  <button
                    onClick={() => navigate(`/update-user/${user.id}`)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-lg"
                  >
                    Update
                  </button>
                )}
                {role === "admin" && user.role !== "admin" && (
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && users.length === 0 && (
          <p className="text-center text-gray-500 mt-10">No users found</p>
        )}
      </div>
    </div>
  );
};

export default AllUsers;