import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getAllLogs, getMyLogs } from "../api/api";
import { Activity } from "lucide-react";

export default function ActivityLogs() {
  const { token, signin, role } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(role === "admin" ? "all" : "mine");

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    setLoading(true);
    const fn = (view === "all" && role === "admin") ? getAllLogs : getMyLogs;
    fn(token)
      .then(d => setLogs(d.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [view, token, role]);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
            <p className="text-gray-400 text-sm mt-1">{logs.length} entries</p>
          </div>
          {role === "admin" && (
            <div className="flex gap-2">
              {["all", "mine"].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    view === v ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  {v === "all" ? "All Users" : "Mine"}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <div className="text-center py-20">
            <Activity size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No activity logs yet</p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-700">
              {logs.map((log, i) => (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-indigo-600/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Activity size={12} className="text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm">{log.action}</p>
                        {log.user && (
                          <p className="text-gray-500 text-xs mt-0.5">
                            by <span className="text-gray-400">{log.user.name}</span>
                            {log.user.role && (
                              <span className="ml-1 text-gray-600 capitalize">({log.user.role})</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-gray-600 text-xs flex-shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}