import asyncHandler from "express-async-handler";
import { Op, literal } from "sequelize";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import ChatUsers from "../models/chatUsersModel.js";
import sequelize from "../config/database.js";

export const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("User Id param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.findAll({
    where: {
      isGroupChat: false,
      "$users.id$": { [Op.in]: [req.user.id, userId] },
    },
    include: [
      {
        model: User,
        as: "users",
        attributes: { exclude: ["password"] },
        through: { attributes: [] },
      },
      {
        model: Message,
        as: "latestMessageRef",
        include: [
          { model: User, as: "senderRef", attributes: ["name", "photo", "email"] },
        ],
      },
    ],
    group: ["Chat.id"],
    having: literal(`COUNT(DISTINCT Chat_Users.userId) = 2`),
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
    });

    await ChatUsers.bulkCreate([
      { chatId: createdChat.id, userId: req.user.id },
      { chatId: createdChat.id, userId },
    ]);

    const fullChat = await Chat.findOne({
      where: { id: createdChat.id },
      include: [
        {
          model: User,
          as: "users",
          attributes: { exclude: ["password"] },
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json(fullChat);
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  const results = await Chat.findAll({
    where: { "$users.id$": req.user.id },
    include: [
      {
        model: User,
        as: "users",
        attributes: { exclude: ["password"] },
        through: { attributes: [] },
      },
      { model: User, as: "groupAdminRef", attributes: { exclude: ["password"] } },
      {
        model: Message,
        as: "latestMessageRef",
        include: [
          { model: User, as: "senderRef", attributes: ["name", "photo", "email"] },
        ],
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  res.status(200).send(results);
});

export const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).send("More than 2 users are required to form a group chat");
  }

  users.push(req.user.id);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    isGroupChat: true,
    groupAdmin: req.user.id,
  });

  await ChatUsers.bulkCreate(users.map((id) => ({ chatId: groupChat.id, userId: id })));

  const fullGroupChat = await Chat.findOne({
    where: { id: groupChat.id },
    include: [
      { model: User, as: "users", attributes: { exclude: ["password"] }, through: { attributes: [] } },
      { model: User, as: "groupAdminRef", attributes: { exclude: ["password"] } },
    ],
  });

  res.status(200).json(fullGroupChat);
});

export const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  await Chat.update({ chatName }, { where: { id: chatId } });

  const updatedChat = await Chat.findOne({
    where: { id: chatId },
    include: [
      { model: User, as: "users", attributes: { exclude: ["password"] }, through: { attributes: [] } },
      { model: User, as: "groupAdminRef", attributes: { exclude: ["password"] } },
    ],
  });

  res.json(updatedChat);
});

export const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  await ChatUsers.destroy({ where: { chatId, userId } });

  const updatedChat = await Chat.findOne({
    where: { id: chatId },
    include: [
      { model: User, as: "users", attributes: { exclude: ["password"] }, through: { attributes: [] } },
      { model: User, as: "groupAdminRef", attributes: { exclude: ["password"] } },
    ],
  });

  res.json(updatedChat);
});

export const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  await ChatUsers.create({ chatId, userId });

  const updatedChat = await Chat.findOne({
    where: { id: chatId },
    include: [
      { model: User, as: "users", attributes: { exclude: ["password"] }, through: { attributes: [] } },
      { model: User, as: "groupAdminRef", attributes: { exclude: ["password"] } },
    ],
  });

  res.json(updatedChat);
});

export const deleteGroupChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  const chat = await Chat.findByPk(chatId);
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  if (chat.isGroupChat && chat.groupAdmin === req.user.id) {
    await Chat.destroy({ where: { id: chatId } });
    res.status(200).json({ message: "Group chat deleted successfully" });
  } else {
    res.status(403).json({ message: "Permission denied" });
  }
});
