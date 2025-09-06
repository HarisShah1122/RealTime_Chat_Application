import { Sequelize, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./userModel.js";
import Message from "./messageModel.js";

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chatName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue("chatName", value.trim());
      },
    },
    isGroupChat: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    groupAdmin: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: User, key: "id" },
    },
    latestMessage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: Message, key: "id" },
    },
  },
  {
    tableName: "chats",
    timestamps: true,
  }
);

Chat.belongsTo(User, { as: "groupAdminRef", foreignKey: "groupAdmin" });
Chat.belongsTo(Message, { as: "latestMessageRef", foreignKey: "latestMessage" });
Chat.belongsToMany(User, {
  through: "Chat_Users",
  foreignKey: "chatId",
  otherKey: "userId",
  as: "users",
});

export default Chat;
