import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getNotifications, markAsRead, markAllAsRead, getOverdueAlerts } from "../api/api";
import { Bell, CheckCheck, AlertTriangle } from "lucide-react";

export default function Notifications() {
  const { token, signin } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!signin) return <Navigate to="/login" />;

  useEffect(() => {
    Promise.all([
      getNotifications(token).then(d => setNotifications(d.data || [])),
      getOverdueAlerts(token).then(d => setOverdue(d.alerts || [])),
    ]).catch(console.error).finally(() => setLoading(false));
  }, [token]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id, token);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      alert(err.message);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-gray-400 text-sm mt-1">
              {unreadCount} unread · {notifications.length} total
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              <CheckCheck size={16} />
              Mark all read
            </button>
          )}
        </div>

        {/* Overdue alerts */}
        {overdue.length > 0 && (
          <div className="mb-6">
            <h2 className="text-amber-400 text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={15} />
              Overdue / Due Soon ({overdue.length})
            </h2>
            <div className="space-y-2">
              {overdue.map(t => (
                <div key={t.id} className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-amber-300 text-sm font-medium">{t.title}</p>
                  <p className="text-amber-400/70 text-xs mt-1">
                    Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : "Unknown"} · Status: {t.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications list */}
        {loading ? (
          <p className="text-gray-400">Loading notifications...</p>
        ) : (
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-20">
                <Bell size={40} className="text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : notifications.map(n => (
              <div
                key={n.id}
                className={`rounded-xl p-4 border transition-colors ${
                  n.is_read
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-gray-800 border-gray-700 shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {!n.is_read && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div>
                      <p className={`text-sm ${n.is_read ? "text-gray-400" : "text-white"}`}>
                        {n.message}
                      </p>
                      {n.Task && (
                        <p className="text-gray-500 text-xs mt-1">Task: {n.Task.title}</p>
                      )}
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-gray-500 hover:text-indigo-400 text-xs flex-shrink-0 transition-colors"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}