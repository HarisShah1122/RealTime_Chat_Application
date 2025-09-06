import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js";
import Chat from "./chatModel.js";

const ChatUsers = sequelize.define("Chat_Users", {
  chatId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: Chat, key: "id" },
  },
  userId: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: User, key: "id" },
  },
}, {
  tableName: "Chat_Users",
  timestamps: false,
});

export default ChatUsers;
