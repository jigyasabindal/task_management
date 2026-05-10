import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import { Op } from "sequelize";

// GET /notification/  — get notifications for logged-in user
export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Task, attributes: ["id", "title", "status", "due_date"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ data: notifications });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching notifications", error: err.message });
  }
};

// PUT /notification/read/:id  — mark single notification as read
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });
    if (notification.user_id !== req.user.id)
      return res.status(403).json({ message: "Access denied" });

    await notification.update({ is_read: true });
    return res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating notification", error: err.message });
  }
};

// PUT /notification/readAll  — mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { is_read: true },
      { where: { user_id: req.user.id, is_read: false } }
    );
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating notifications", error: err.message });
  }
};

// GET /notification/overdue  — tasks due within 3 days (alert system)
export const getOverdueAlerts = async (req, res) => {
  try {
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);

    const tasks = await Task.findAll({
      where: {
        status: { [Op.ne]: "completed" },
        due_date: { [Op.between]: [now, threeDaysLater] },
        assigned_to: req.user.role === "member" ? req.user.id : { [Op.ne]: null },
      },
    });

    return res.status(200).json({ message: "Overdue alerts", alerts: tasks });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching alerts", error: err.message });
  }
};