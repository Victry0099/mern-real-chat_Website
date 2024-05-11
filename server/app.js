import { connectDB } from "./utils/features.js";
import express from "express";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import {
  CHAT_JOIN,
  CHAT_LEAVED,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USERS,
  START_TYPING,
  STOP_TYPING,
} from "./constants/event.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { corsOption } from "./constants/config.js";
import { socketAutenticator } from "./middlewares/auth.js";

import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
// console.log(process.env.PORT);
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey =
  process.env.ADMIN_SECRET_KEY || "vict@#pr@k@3hKulma*%vbltp#7&kgzprakash";

const userSocketIDs = new Map();

// ? create express app

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOption,
});

app.set("io", io);

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

// ? connect to database
connectDB(mongoURI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const onlineUsers = new Set();

// ? Routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

// ? Home Route

app.get("/", (req, res) => {
  res.send("Hello World");
});

// ! here we start socket io

io.use(async (socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (error) => {
    await socketAutenticator(error, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;
  // console.log(user);

  userSocketIDs.set(user._id.toString(), socket.id);

  // console.log(userSocketIDs);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const nessageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };
    const memberSocket = getSockets(members);

    io.to(memberSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });
    io.to(memberSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    // ? Save message to DB
    try {
      await Message.create(nessageForDB);
    } catch (error) {
      console.error(error);
      // console.log(error);
    }
    // console.log("new message", messageForRealTime);
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    // console.log("start-typing", chatId);

    const membersSocket = getSockets(members);

    socket.to(membersSocket).emit(START_TYPING, { chatId });
  });

  socket.on(STOP_TYPING, ({ members, chatId }) => {
    // console.log("stop-typing", chatId);

    const membersSocket = getSockets(members);

    socket.to(membersSocket).emit(STOP_TYPING, { chatId });
  });

  socket.on(CHAT_JOIN, ({ userId, members }) => {
    onlineUsers.add(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    // console.log("online users", Array.from(onlineUsers));
  });

  socket.on(CHAT_LEAVED, ({ userId, members }) => {
    onlineUsers.delete(userId.toString());

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
    // console.log("offline users", Array.from(onlineUsers));
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
    userSocketIDs.delete(user._id.toString());
    onlineUsers.delete(user._id.toString());

    socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers));
  });
});

// ? Error Middleware
app.use(errorMiddleware);

server.listen(port, () => {
  console.log(
    `Server is running on port ${envMode} in ${process.env.NODE_ENV} mode  ${port}`
  );
});

export { envMode, adminSecretKey, userSocketIDs };
