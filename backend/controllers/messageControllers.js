
import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";

/**
 * @desc    Get all messages from a chat
 * @route   GET /api/message/:chatId
 * @access  Private
 */
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chat: req.params.chatId },
      include: [
        {
          model: User,
          as: "senderRef",
          attributes: ["id", "name", "photo", "email"],
        },
        {
          model: Chat,
          as: "chatRef",
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "name", "photo", "email"],
            },
          ],
        },
      ],
    });

    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

/**
 * @desc    Send a new message
 * @route   POST /api/message
 * @access  Private
 */
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  const newMessage = {
    sender: req.user.id, // user comes from protect middleware
    content,
    chat: chatId,
  };

  try {
    // create message
    let message = await Message.create(newMessage);

    // fetch message with sender & chat details
    message = await Message.findOne({
      where: { id: message.id },
      include: [
        {
          model: User,
          as: "senderRef",
          attributes: ["id", "name", "photo"],
        },
        {
          model: Chat,
          as: "chatRef",
          include: [
            {
              model: User,
              as: "users",
              attributes: ["id", "name", "photo", "email"],
            },
          ],
        },
      ],
    });

    // update latest message in chat
    await Chat.update({ latestMessage: message.id }, { where: { id: chatId } });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { allMessages, sendMessage };
