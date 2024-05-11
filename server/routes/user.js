import express from "express";
const app = express.Router();
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.js";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validatorHandler,
} from "../lib/validators.js";

app.post("/new", singleAvatar, registerValidator(), validatorHandler, newUser);
app.post("/login", loginValidator(), validatorHandler, login);

// ? After here user muse be logged in to access route

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);

app.put(
  "/send-request",
  sendRequestValidator(),
  validatorHandler,
  sendFriendRequest
);

app.put(
  "/accept-request",
  acceptRequestValidator(),
  validatorHandler,
  acceptFriendRequest
);

app.get("/notifications", getMyNotifications);

app.get("/friends", getMyFriends);
export default app;
