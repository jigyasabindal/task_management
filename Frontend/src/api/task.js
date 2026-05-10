import { apiFetch } from "./api";

export const createTask = (form, token) =>
    apiFetch("/task/createTask", "POST", form, token);

export const deleteTask = (id, token) =>
    apiFetch(`/task/deleteTask/${id}`, "DELETE", null, token);

export const updateTask = (id, form, token) =>
    apiFetch(`/task/updateTask/${id}`, "PUT", form, token);

export const getMyTasks = (token) =>
    apiFetch("/task/findTasks", "GET", null, token);

export const getAllTasks = (token) =>
    apiFetch("/task/tasks", "GET", null, token);