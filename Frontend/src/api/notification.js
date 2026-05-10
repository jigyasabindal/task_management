import { apiFetch } from "./api";

export const getNotifications = (token) =>
    apiFetch("/notification/notifications", "GET", null, token);