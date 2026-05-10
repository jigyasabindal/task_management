import { apiFetch } from "./api";

export const loginUser = (email, password) =>
    apiFetch("/user/login", "POST", { email, password });

export const registerUser = (form, token) =>
    apiFetch("/user/register", "POST", form, token);

export const getAllUsers = (token) =>
    apiFetch("/user/getUsers", "GET", null, token);

export const deleteUser = (id, token) =>
    apiFetch(`/user/deleteUser/${id}`, "DELETE", null, token);

export const updateUser = (id, form, token) =>
    apiFetch(`/user/updateUser/${id}`, "PUT", form, token);

export const findUser = (id) =>
    apiFetch(`/user/find/${id}`);

export const getManagers = (token) =>
    apiFetch("/user/managers", "GET", null, token);