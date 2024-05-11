import { body, validationResult, param, query } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";

const validatorHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessage = errors
    .array()
    .map((error) => error.msg)
    .join(", ");
  console.log(errorMessage);

  if (errors.isEmpty()) {
    return next();
  } else {
    next(new ErrorHandler(errorMessage, 400));
  }
};

const registerValidator = () => [
  body("name")
    .notEmpty()
    .withMessage("Please Enter Nname")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 to 20 characters"),

  body("username")
    .notEmpty()
    .withMessage("Please Enter Username")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 to 20 characters"),

  body("bio", "Please Enter bio").notEmpty(),

  body("password", "Please Enter Password").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please Enter Username")
    .notEmpty()
    .withMessage(" please Enter valid Username"),
  body("password", "Please Enter Password").notEmpty(),
];

const newGroupValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 2, max: 100 })
    .withMessage("members must be 2-100"),
];

const addMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("members added 1-97"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("userId", "Please Enter User ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];

const chatIdValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  // query("page", "Please Enter Page").notEmpty(),
];

const renameGroupValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter new group Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please Enter user ID").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter request Id ").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Accept or Reject request")
    .isBoolean()
    .withMessage("Accept must be boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];

export {
  registerValidator,
  loginValidator,
  validatorHandler,
  newGroupValidator,
  addMemberValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  chatIdValidator,
  renameGroupValidator,
  sendRequestValidator,
  acceptRequestValidator,
  adminLoginValidator,
};
