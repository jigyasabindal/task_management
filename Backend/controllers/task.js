import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import Comment from "../models/Comment.js";
import ActivityLog from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../config/mailer.js";

// POST /task/createTask  — project_manager only
export const createTask = async (req, res) => {
  try {
    const { project_id, title, description, status, assigned_to, due_date } = req.body;

    const task = await Task.create({
      project_id,
      title,
      description,
      status: status || "pending",
      assigned_to,
      due_date,
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Task created: "${task.title}" in project id=${project_id}`,
    });

    // Notify assigned user
    if (assigned_to) {
      await Notification.create({
        user_id: assigned_to,
        task_id: task.id,
        message: `You have been assigned a new task: "${title}"`,
      });

      // Send email to assigned user
      const assignee = await User.findByPk(assigned_to);
      if (assignee) {
        await sendEmail(
          assignee.email,
          `New Task Assigned: ${title}`,
          `<h3>Hi ${assignee.name},</h3>
           <p>You have been assigned a new task by <b>${req.user.name}</b>.</p>
           <p><b>Task:</b> ${title}</p>
           <p><b>Description:</b> ${description || "N/A"}</p>
           <p><b>Due Date:</b> ${due_date ? new Date(due_date).toDateString() : "Not set"}</p>
           <p>Login to view details: <a href="http://localhost:5173">TaskFlowSpirit</a></p>`
        );
      }
    }

    return res.status(201).json({ message: "Task created successfully", taskId: task.id });
  } catch (err) {
    return res.status(500).json({ message: "Task could not be created", error: err.message });
  }
};

// GET /task/getAllTasks  — all authenticated users
export const getAllTasks = async (req, res) => {
  try {
    const where = {};
    // members only see their own tasks
    if (req.user.role === "member") where.assigned_to = req.user.id;

    const tasks = await Task.findAll({
      where,
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: Project, attributes: ["id", "project_name"] },
      ],
    });
    return res.status(200).json({ message: "Tasks fetched successfully", data: tasks });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// GET /task/find/:id
export const find = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: Project, attributes: ["id", "project_name"] },
        { model: Comment, include: [{ model: User, as: "author", attributes: ["id", "name"] }] },
      ],
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    return res.status(200).json({ data: task });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching task", error: err.message });
  }
};

// GET /task/byProject/:project_id
export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { project_id: req.params.project_id },
      include: [{ model: User, as: "assignee", attributes: ["id", "name"] }],
    });
    return res.status(200).json({ data: tasks });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching tasks", error: err.message });
  }
};

// PUT /task/updateTask/:id  — project_manager OR assigned member
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const isManager = req.user.role === "project_manager" || req.user.role === "admin";
    const isAssignee = task.assigned_to === req.user.id;

    if (!isManager && !isAssignee) {
      return res.status(403).json({ message: "Access denied" });
    }

    const oldAssignee = task.assigned_to;
    await task.update({
      status: req.body.status ?? task.status,
      assigned_to: req.body.assigned_to ?? task.assigned_to,
      due_date: req.body.due_date ?? task.due_date,
      title: req.body.title ?? task.title,
      description: req.body.description ?? task.description,
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Task updated: "${task.title}" id=${task.id} status=${task.status}`,
    });

    // Notify if reassigned
    if (req.body.assigned_to && req.body.assigned_to !== oldAssignee) {
      await Notification.create({
        user_id: req.body.assigned_to,
        task_id: task.id,
        message: `Task "${task.title}" has been reassigned to you.`,
      });
    }

    // Notify if status changed
    if (req.body.status && req.body.status !== task.status && task.assigned_to) {
      await Notification.create({
        user_id: task.assigned_to,
        task_id: task.id,
        message: `Task "${task.title}" status changed to ${req.body.status}.`,
      });
    }

    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

// DELETE /task/deleteTask/:id  — project_manager only
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const taskTitle = task.title;
    await task.destroy();

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Task deleted: "${taskTitle}" id=${req.params.id}`,
    });

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};