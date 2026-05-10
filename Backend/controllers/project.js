import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import ActivityLog from "../models/ActivityLog.js";

// POST /project/createProject  — admin only
export const createProject = async (req, res) => {
  try {
    const existing = await Project.findOne({ where: { project_name: req.body.name } });
    if (existing) return res.status(400).json({ message: "Project already exists!" });

    const project = await Project.create({
      project_name: req.body.name,
      description: req.body.description,
      created_by: req.user.id,
    });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Project created: "${project.project_name}"`,
    });

    return res.status(201).json({ message: "Project created successfully", projectId: project.id });
  } catch (err) {
    return res.status(500).json({ message: "Error creating project", error: err.message });
  }
};

// GET /project/getProjects  — admin & project_manager
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: User, as: "creator", attributes: ["id", "name", "email"] }],
    });
    return res.status(200).json({ message: "Projects fetched successfully", data: projects });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching projects", error: err.message });
  }
};

// GET /project/getProject/:id
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        {
          model: Task,
          include: [{ model: User, as: "assignee", attributes: ["id", "name"] }],
        },
      ],
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    return res.status(200).json({ data: project });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching project", error: err.message });
  }
};

// PUT /project/update/:id  — admin only
export const updateProject = async (req, res) => {
  try {
    const [updated] = await Project.update(
      { project_name: req.body.name, description: req.body.description },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ message: "Project not found" });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Project updated id=${req.params.id}`,
    });

    return res.status(200).json({ message: "Project updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error updating project", error: err.message });
  }
};

// DELETE /project/delete/:id  — admin only
export const deleteProjects = async (req, res) => {
  try {
    const deleted = await Project.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Project not found" });

    await ActivityLog.create({
      user_id: req.user.id,
      action: `Project deleted id=${req.params.id}`,
    });

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting project", error: err.message });
  }
};