import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import { sendEmail } from "../config/mailer.js";
dotenv.config();

const SECRET = process.env.JWT_SECRET || "supersecretjwtkey2024";

// POST /user/register  — PUBLIC self-signup (role always "member")
export const publicRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    // Force role to "member" — public users cannot self-assign admin/manager
    const user = await User.create({ name, email, password, role: "member" });

    await ActivityLog.create({
      user_id: user.id,
      action: `New user self-registered: ${user.name}`,
    });

    // Send welcome email (non-blocking — don't crash if it fails)
    sendEmail(
      email,
      "Welcome to TaskFlowSpirit 🎉",
      `<h2>Hi ${name},</h2>
       <p>Your account has been created successfully.</p>
       <p><b>Email:</b> ${email}</p>
       <p><b>Role:</b> member</p>
       <p>Login at <a href="http://localhost:5173/login">TaskFlowSpirit</a></p>`
    ).catch(() => {});

    // Return token so frontend can auto-login after signup
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

// POST /user/createUser  — ADMIN only (can assign any role)
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields including role are required." });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered." });

    const user = await User.create({ name, email, password, role });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Admin registered new user: ${user.name} (${user.role})`,
    });

    sendEmail(
      email,
      "Welcome to TaskFlowSpirit 🎉",
      `<h2>Hi ${name},</h2>
       <p>Your account has been created by an admin.</p>
       <p><b>Email:</b> ${email}</p>
       <p><b>Role:</b> ${role}</p>
       <p>Login at <a href="http://localhost:5173/login">TaskFlowSpirit</a></p>`
    ).catch(() => {});

    return res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    return res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

// POST /user/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "Invalid email or password." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );

    await ActivityLog.create({ user_id: user.id, action: "User logged in" });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Login error", error: err.message });
  }
};

// DELETE /user/deleteUser/:id  — admin only
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "User not found" });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Admin deleted user id=${req.params.id}`,
    });

    return res.json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

// PUT /user/updateUser/:id
export const updateUser = async (req, res) => {
  try {
    const updateData = { name: req.body.name, email: req.body.email, role: req.body.role };
    if (req.body.password) updateData.password = req.body.password;

    const [updated] = await User.update(updateData, {
      where: { id: req.params.id },
      individualHooks: true,
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `User updated profile id=${req.params.id}`,
    });

    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

// GET /user/getUsers
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    return res.status(200).json({ message: "Users fetched successfully", data: users });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

// GET /user/find/:id
export const find = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User fetched", data: user });
  } catch (err) {
    return res.status(500).json({ message: "Error finding user", error: err.message });
  }
};