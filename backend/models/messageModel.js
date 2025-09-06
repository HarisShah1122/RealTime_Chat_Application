
import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender: { 
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "User", key: "id" },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      set(value) {
        this.setDataValue("content", value.trim());
      },
    },
    chat: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "Chat", key: "id" },
    },
  },
  {
    tableName: "messages",
    timestamps: true,
  }
);

export default Message;
