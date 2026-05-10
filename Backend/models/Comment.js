import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Task from "./Task.js";
import User from "./User.js";

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Task, key: "id" },
      onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "comments",
    timestamps: true,
  }
);

Comment.belongsTo(Task, { foreignKey: "task_id" });
Comment.belongsTo(User, { foreignKey: "user_id", as: "author" });
Task.hasMany(Comment, { foreignKey: "task_id", onDelete: "CASCADE" });

export default Comment;