import { apiFetch } from "./api";

export const createProject = (form, token) =>
    apiFetch("/project/createProject", "POST", form, token);

export const getAllProjects = (token) =>
    apiFetch("/project/projects", "GET", null, token);

export const getMyProjects = (token) =>
    apiFetch("/project/my-projects", "GET", null, token);

export const deleteProject = (id, token) =>
    apiFetch(`/project/deleteProject/${id}`, "DELETE", null, token);

export const getUsersUnderManager = (token) =>
    apiFetch("/project/manager/users", "GET", null, token);

export const getPendingTasks = (token) =>
    apiFetch("/project/tasks-pending", "GET", null, token);