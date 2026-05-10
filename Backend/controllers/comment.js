import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";

// POST /comment/:taskId  — any authenticated user
export const addComment = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = await Comment.create({
      task_id: task.id,
      user_id: req.user.id,
      comment: req.body.comment,
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Commented on task: "${task.title}" id=${task.id}`,
    });

    // Notify task assignee (if different from commenter)
    if (task.assigned_to && task.assigned_to !== req.user.id) {
      await Notification.create({
        user_id: task.assigned_to,
        task_id: task.id,
        message: `${req.user.name} commented on your task: "${task.title}"`,
      });
    }

    return res.status(201).json({ message: "Comment added successfully", commentId: comment.id });
  } catch (err) {
    return res.status(500).json({ message: "Error adding comment", error: err.message });
  }
};

// GET /comment/:taskId  — get all comments for a task
export const getComments = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comments = await Comment.findAll({
      where: { task_id: req.params.id },
      include: [{ model: User, as: "author", attributes: ["id", "name"] }],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({ data: comments });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching comments", error: err.message });
  }
};

// DELETE /comment/delete/:id  — comment owner or admin
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await comment.destroy();
    await ActivityLog.create({
      user_id: req.user.id,
      action: `Comment deleted id=${req.params.id}`,
    });

    return res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting comment", error: err.message });
  }
};