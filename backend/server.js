import express from "express";
import dotenv from "dotenv";
import config from "./config/config.js";
import sequelize from "./config/database.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webapp = express();
dotenv.config();

webapp.use(express.json());
webapp.use("/api/user", userRoutes);
webapp.use("/api/chat", chatRoutes);
webapp.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  webapp.use(express.static(path.join(__dirname, "frontend/build")));
  webapp.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  webapp.get("/", (req, res) => {
    res.send("Our API is running fine");
  });
}

webapp.use(notFound);
webapp.use(errorHandler);

const port = config.port || 8080;
const server = webapp.listen(
  port,
  () => console.log(`The server started at port ${port}`.blue.bold)
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData.id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user.id === newMessageRecieved.sender.id) return;
      socket.in(user.id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User is disconnected");
    socket.leaveAll();
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    socket.leaveAll();
  });
});
