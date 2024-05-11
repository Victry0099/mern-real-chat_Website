import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  getAdminData,
  getDashboardStats,
} from "../controllers/admin.controller.js";
import { adminLoginValidator, validatorHandler } from "../lib/validators.js";
import { isAdminOnly } from "../middlewares/auth.js";
const app = express.Router();

app.post("/verify", adminLoginValidator(), validatorHandler, adminLogin);
app.get("/logout", adminLogout);

// ? this Routes access for the admin dashboard and admin only

app.use(isAdminOnly);

app.get("/", getAdminData);

app.get("/all-users", allUsers);

app.get("/all-chats", allChats);

app.get("/all-messages", allMessages);

app.get("/stats", getDashboardStats);

export default app;
