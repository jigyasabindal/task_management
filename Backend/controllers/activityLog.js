import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";

// GET /activity/  — admin only, all logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [{ model: User, as: "user", attributes: ["id", "name", "role"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ data: logs });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching logs", error: err.message });
  }
};

// GET /activity/mine  — logged-in user's own logs
export const getMyLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ data: logs });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching logs", error: err.message });
  }
};

// GET /activity/user/:id  — admin only, logs for specific user
export const getLogsByUser = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      where: { user_id: req.params.id },
      include: [{ model: User, as: "user", attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ data: logs });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching logs", error: err.message });
  }
};