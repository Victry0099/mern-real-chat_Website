import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import {
  addMemberValidator,
  chatIdValidator,
  newGroupValidator,
  removeMemberValidator,
  renameGroupValidator,
  sendAttachmentsValidator,
  validatorHandler,
} from "../lib/validators.js";
const app = express.Router();

// ? After here user muse be logged in to access route

app.use(isAuthenticated);

app.post("/new", newGroupValidator(), validatorHandler, newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMemberValidator(), validatorHandler, addMembers);

app.delete(
  "/removemember",
  removeMemberValidator(),
  validatorHandler,
  removeMember
);

app.delete("/leave/:id", chatIdValidator(), validatorHandler, leaveGroup);

// send attachments to the database
app.post(
  "/message",
  attachmentsMulter,
  sendAttachmentsValidator(),
  validatorHandler,
  sendAttachments
);

// get messages

app.get("/message/:id", chatIdValidator(), validatorHandler, getMessages);

// get chat details, rename, delete
app
  .route("/:id")
  .get(chatIdValidator(), validatorHandler, getChatDetails)
  .put(renameGroupValidator(), validatorHandler, renameGroup)
  .delete(deleteChat);

export default app;
