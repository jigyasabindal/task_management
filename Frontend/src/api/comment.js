import { apiFetch } from "./api";

export const addComment = (taskId, comment, token) =>
    apiFetch(`/comment/comment/${taskId}`, "POST", { comment }, token);