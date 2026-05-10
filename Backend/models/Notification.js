import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Task from "./Task.js";

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
      onDelete: "CASCADE",
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Task, key: "id" },
      onDelete: "SET NULL",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

Notification.belongsTo(User, { foreignKey: "user_id" });
Notification.belongsTo(Task, { foreignKey: "task_id" });
User.hasMany(Notification, { foreignKey: "user_id" });

export default Notification;