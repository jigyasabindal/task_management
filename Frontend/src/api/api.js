const BASE_URL = "http://localhost:3000";

export const apiFetch = async (endpoint, method = "GET", body = null, token = null) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

// ── USERS ─────────────────────────────────────────────────────────
export const loginUser    = (body)              => apiFetch("/user/login", "POST", body);
export const publicSignup = (body)              => apiFetch("/user/register", "POST", body);       // no token
export const registerUser = (body, token)       => apiFetch("/user/createUser", "POST", body, token); // admin
export const getAllUsers   = (token)             => apiFetch("/user/getUsers", "GET", null, token);
export const findUser     = (id, token)         => apiFetch(`/user/find/${id}`, "GET", null, token);
export const updateUser   = (id, body, token)   => apiFetch(`/user/updateUser/${id}`, "PUT", body, token);
export const deleteUser   = (id, token)         => apiFetch(`/user/deleteUser/${id}`, "DELETE", null, token);

// ── PROJECTS ──────────────────────────────────────────────────────
export const getAllProjects  = (token)           => apiFetch("/project/getProjects", "GET", null, token);
export const getProjectById  = (id, token)      => apiFetch(`/project/getProject/${id}`, "GET", null, token);
export const createProject   = (body, token)    => apiFetch("/project/createProject", "POST", body, token);
export const updateProject   = (id, body, token)=> apiFetch(`/project/update/${id}`, "PUT", body, token);
export const deleteProject   = (id, token)      => apiFetch(`/project/delete/${id}`, "DELETE", null, token);

// ── TASKS ─────────────────────────────────────────────────────────
export const getAllTasks      = (token)          => apiFetch("/task/getAllTasks", "GET", null, token);
export const findTask        = (id, token)       => apiFetch(`/task/find/${id}`, "GET", null, token);
export const getTasksByProject = (pid, token)   => apiFetch(`/task/byProject/${pid}`, "GET", null, token);
export const createTask      = (body, token)    => apiFetch("/task/createTask", "POST", body, token);
export const updateTask      = (id, body, token)=> apiFetch(`/task/updateTask/${id}`, "PUT", body, token);
export const deleteTask      = (id, token)      => apiFetch(`/task/deleteTask/${id}`, "DELETE", null, token);

// ── COMMENTS ─────────────────────────────────────────────────────
export const getComments    = (taskId, token)   => apiFetch(`/comment/${taskId}`, "GET", null, token);
export const addComment     = (taskId, body, token) => apiFetch(`/comment/${taskId}`, "POST", body, token);
export const deleteComment  = (id, token)       => apiFetch(`/comment/delete/${id}`, "DELETE", null, token);

// ── NOTIFICATIONS ─────────────────────────────────────────────────
export const getNotifications = (token)         => apiFetch("/notification/", "GET", null, token);
export const getOverdueAlerts = (token)         => apiFetch("/notification/overdue", "GET", null, token);
export const markAsRead       = (id, token)     => apiFetch(`/notification/read/${id}`, "PUT", null, token);
export const markAllAsRead    = (token)         => apiFetch("/notification/readAll", "PUT", null, token);

// ── ACTIVITY LOGS ─────────────────────────────────────────────────
export const getAllLogs = (token) => apiFetch("/activity/", "GET", null, token);
export const getMyLogs  = (token) => apiFetch("/activity/mine", "GET", null, token);