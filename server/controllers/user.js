import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/event.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOption,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { getOtherMember } from "../lib/helper.js";

// ? create a new user and save it to the database and save in cookie
// const newUser = TryCatch(async (req, res, next) => {
//   const { name, username, password, bio } = req.body;

//   const file = req.file;
//   // console.log("file", file);

//   if (!file) {
//     return next(new ErrorHandler("Please upload a avatar", 400));
//   }

//   const result = uploadFilesToCloudinary([file]);
//   // console.log(req.body);
//   const avatar = {
//     public_id: result[0].public_id,
//     url: result[0].url,
//   };

//   const user = await User.create({
//     name,
//     username,
//     password,
//     avatar,
//     bio,
//   });

//   sendToken(res, user, 201, "User created");
// });

const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;

  const file = req.file;

  if (!file) {
    return next(new ErrorHandler("Please upload an avatar", 400));
  }

  try {
    const result = await uploadFilesToCloudinary([file]);

    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const user = await User.create({
      name,
      username,
      password,
      avatar,
      bio,
    });

    sendToken(res, user, 201, "User created");
  } catch (error) {
    next(new ErrorHandler("Error creating user", 500));
  }
});

// ? login user and save token in cookie
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid username or Password", 400));
  }

  const isMatch = await compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Invalid username or Password", 400));
  }
  sendToken(res, user, 200, `Welcome Back ${user.name}`);
});

// ? get my profile
const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  res.status(200).json({
    success: true,
    user,
  });
});

// ? logout user and clear cookie
const logout = TryCatch(async (req, res) => {
  res
    .status(200)
    .cookie("funfusion-token", "", { ...cookieOption, maxAge: 0 })
    .json({
      success: true,
      message: "logged out successfully",
    });
});

// ? search user with name and username
const searchUser = TryCatch(async (req, res, next) => {
  let searchTerm = req.query.name;

  // ? if search term is empty
  if (!searchTerm || searchTerm.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Search term is required" });
  }

  const myChats = await Chat.find({ groupChat: false, members: req.user });
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Find users whose name or username matches the search term
  const usersMatchingSearch = await User.find({
    _id: { $nin: allUsersFromMyChats },
    $or: [
      { name: { $regex: new RegExp(searchTerm, "i") } }, // Case-insensitive search
      { username: { $regex: new RegExp(searchTerm, "i") } }, // Case-insensitive search for username
    ],
  });

  const users = usersMatchingSearch.map(({ _id, name, avatar, username }) => ({
    _id,
    name,
    username,
    avatar: avatar.url,
  }));

  res.status(200).json({
    success: true,
    users,
  });
});

// ? send friend request

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  // Check if the sender and receiver are the same
  if (req.user === userId) {
    return next(
      new ErrorHandler("You cannot send a friend request to yourself", 400)
    );
  }

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) {
    return next(new ErrorHandler("Request already sent", 409));
  }

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  res.status(200).json({
    success: true,
    message: "Friend request sent successfully",
  });
});

// ? accept friend request
// const acceptFriendRequest = TryCatch(async (req, res, next) => {
//   const { requestId, accept } = req.body;

//   const request = await Request.findById(requestId)
//     .populate("sender", "name")
//     .populate("receiver", "name");

//   console.log(request);
//   if (!request) {
//     return next(new ErrorHandler("Request not found", 404));
//   }

//   if (req.receiver._id.toString() !== req.user.toString()) {
//     return next(new ErrorHandler("You are not authorized", 401));
//   }

//   if (!request) {
//     await request.deleteOne();
//     return res.status(200).json({
//       success: true,
//       message: "Friend Request Rejected",
//     });
//   }

//   const members = [request.sender._id, request.receiver._id];

//   await Promise.all([
//     Chat.create({
//       members,
//       name: `${request.sender.name}-${request.receiver.name}`,
//     }),
//     request.deleteOne(),
//   ]);

//   emitEvent(req, REFETCH_CHATS, members);

//   res.status(200).json({
//     success: true,
//     message: " Friend Request Accepted",
//     senderId: request.sender._id,
//     receiverId: request.receiver._id,
//   });
// });

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) {
    return res.status(404).json({
      success: false,
      error: {
        message: "Request not found",
        statusCode: 404,
      },
    });
  }

  // Check if the user is authorized to accept/reject the request
  if (request.receiver._id.toString() !== req.user.toString()) {
    return res.status(401).json({
      success: false,
      error: {
        message: "You are not authorized to accept/reject this request",
        statusCode: 401,
      },
    });
  }

  // If 'accept' is false, reject the request
  if (!accept) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    senderId: request.sender._id,
    receiverId: request.receiver._id,
  });
});

const getMyNotifications = TryCatch(async (req, res, next) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  res.status(200).json({
    success: true,
    allRequests,
  });
});

// const getMyFriends = TryCatch(async (req, res, next) => {
//   const chatId = req.query.chatId;

//   const chats = await Chat.find({
//     members: req.user,
//     groupChat: false,
//   }).populate("members", "name avatar");

//   const friends = chats.map(({ members }) => {
//     const otherUser = getOtherMember(members, req.user);
//     return {
//       _id: otherUser._id,
//       name: otherUser.name,
//       avatar: otherUser.avatar.url,
//     };
//   });

//   if (chatId) {
//     const chat = await Chat.findById(chatId);
//     const availableFriends = friends.filter(
//       (friend) => !chat.members.includes(friend._id)
//     );
//     return res.status(200).json({
//       success: true,
//       friends: availableFriends,
//     });
//   } else {
//     return res.status(200).json({
//       success: true,
//       friends,
//     });
//   }
// });

const getMyFriends = TryCatch(async (req, res, next) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats
    .map(({ members }) => {
      const otherUser = getOtherMember(members, req.user);
      if (!otherUser) {
        return null; // Skip this entry if otherUser is not found
      }
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar ? otherUser.avatar.url : null, // Check if avatar exists
      };
    })
    .filter(Boolean); // Filter out null entries

  if (chatId) {
    const chat = await Chat.findById(chatId); // Remove curly braces around chatId
    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );
    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});

export {
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
