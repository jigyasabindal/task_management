import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Project from "./Project.js";
import User from "./User.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Project, key: "id" },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM("pending", "in_progress", "completed"),
      defaultValue: "pending",
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      references: { model: User, key: "id" },
      onDelete: "SET NULL",
    },
    due_date: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "tasks",
    timestamps: true,
  }
);

Task.belongsTo(Project, { foreignKey: "project_id" });
Task.belongsTo(User, { foreignKey: "assigned_to", as: "assignee" });
Project.hasMany(Task, { foreignKey: "project_id", onDelete: "CASCADE" });
User.hasMany(Task, { foreignKey: "assigned_to" });

export default Task;