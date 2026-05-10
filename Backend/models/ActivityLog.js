import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const ActivityLog = sequelize.define(
  "ActivityLog",
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
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: true,
  }
);

ActivityLog.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(ActivityLog, { foreignKey: "user_id" });

export default ActivityLog;