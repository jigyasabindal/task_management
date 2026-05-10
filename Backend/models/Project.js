import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
  },
  {
    tableName: "projects",
    timestamps: true,
  }
);

Project.belongsTo(User, { foreignKey: "created_by", as: "creator" });
User.hasMany(Project, { foreignKey: "created_by" });

export default Project;