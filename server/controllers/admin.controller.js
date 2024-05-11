import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { cookieOption } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { adminSecretKey } from "../app.js";

// ! this only access by admin

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Amdmin Secret Key", 401));
  }

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  res
    .status(200)
    .cookie("funfusion-admin-token", token, {
      ...cookieOption,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authentication  Successfully, Wellcome BldVictry Developer",
    });
});

const adminLogout = TryCatch(async (req, res, next) => {
  res
    .status(200)
    .cookie("funfusion-admin-token", "", {
      ...cookieOption,
      maxAge: 0,
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Admin Logout Successfully",
    });
});

const getAdminData = TryCatch(async (req, res, next) => {
  res.status(200).json({
    success: true,
    admin: true,
  });
});

const allUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, username, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);
      return {
        name,
        username,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  res.status(200).json({
    success: true,
    users: transformedUsers,
  });
});

// ? this code not use optnal chaining
// const allChats = TryCatch(async (req, res) => {
//   const chats = await Chat.find({})
//     .populate("members", "name  avatar")
//     .populate("creator", "name  avatar");

//   const transformedChats = await Promise.all(
//     chats.map(async ({ members, _id, groupChat, name, creator }) => {
//       const totalMessages = await Message.countDocuments({ chat: _id });

//       return {
//         _id,
//         groupChat,
//         name,

//         avatar: members.slice(0, 3).map((member) => member.avatar.ur),
//         members: members.map(({ _id, name, avatar }) => ({
//           _id,
//           name,
//           avatar: avatar.url,
//         })),
//         creator: {
//           name: creator?.name || "None",
//           avatar: creator?.avatar.url || "None",
//         },
//         totalMembers: members.length,
//         totalMessages,
//       };
//     })
//   );

//   res.status(200).json({
//     success: true,
//     transformedChats,
//   });
// });

// ? this code  use optnal chaining for bettor performence
const allChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      // Fetching avatar URLs for up to 3 members
      const avatarURLs = members
        .slice(0, 3)
        .map((member) => member.avatar?.url);

      // Transforming members array
      const transformedMembers = members.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar?.url || "None",
      }));

      // Transforming creator object
      const transformedCreator = {
        name: creator?.name || "None",
        avatar: creator?.avatar?.url || "None",
      };

      return {
        _id,
        groupChat,
        name,
        avatar: avatarURLs,
        members: transformedMembers,
        creator: transformedCreator,
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const allMessages = TryCatch(async (req, res, next) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      content,
      attachments,
      _id,
      createdAt,
      chat: chat ? chat._id : null,
      groupChat: chat ? chat.groupChat : null,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});

//   const [groupsCount, usersCount, messagesCount, totalChatsCount] =
//     await Promise.all([
//       Chat.countDocuments({ groupChat: true }),
//       User.countDocuments(),
//       Message.countDocuments(),
//       Chat.countDocuments(),
//     ]);

//   const stats = {
//     groupsCount,
//     usersCount,
//     messagesCount,
//     totalChatsCount,
//   };
//   const today = new Date();
//   const last7Days = new Date();
//   last7Days.setDate(last7Days.getDate() - 7);

//   const last7DaysMessages = await Message.find({
//     createdAt: {
//       $gte: last7Days,
//       $lte: today,
//     },
//   }).select("createdAt");

//   const messages = new Array(7).fill(0);

//   last7DaysMessages.forEach((message) => {
//     const dayInMiliSecond = 1000 * 60 * 60 * 24;
//     const indexAprox =
//       (today.getTime() - message.createdAt.getTime()) / dayInMiliSecond;

//     const index = Math.floor(indexAprox);
//     messages[6 - index]++;
//   });

//   console.log("Today:", today);
//   console.log("Last 7 Days:", last7Days);
//   console.log("Total Messages:", last7DaysMessages.length);
//   console.log("Messages:", messages);

//   res.status(200).json({
//     success: true,
//     stats,
//     chart: messages,
//   });
// });

const getDashboardStats = TryCatch(async (req, res, next) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
  };

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);

  last7DaysMessages.forEach((message) => {
    const messageDate = new Date(message.createdAt);
    const dayDifference = Math.floor(
      (today - messageDate) / (1000 * 60 * 60 * 24)
    );
    if (dayDifference >= 0 && dayDifference < 7) {
      messages[6 - dayDifference]++;
    }
  });

  res.status(200).json({
    success: true,
    stats,
    messagesChart: messages,
  });
});

export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
};
