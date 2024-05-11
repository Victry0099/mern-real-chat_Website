import { ErrorHandler } from "../utils/utility.js";
import { TryCatch } from "./error.js";
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { FUNFUSION_TOKEN } from "../constants/config.js";
import { User } from "../models/user.js";

// Check if user is authenticated or not

const isAuthenticated = (req, res, next) => {
  // console.log("cookies", req.cookies["funfusion-token"]);

  const token = req.cookies[FUNFUSION_TOKEN];

  if (!token) {
    return next(new ErrorHandler("Please login to access this route", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodedData);

  req.user = decodedData._id;

  //   req.user = await User.findById(decodedData.id);
  next();
};

const isAdminOnly = (req, res, next) => {
  const token = req.cookies["funfusion-admin-token"];

  if (!token) {
    return next(new ErrorHandler(" Only admin access this route", 401));
  }

  const secretKey = jwt.verify(token, process.env.JWT_SECRET);

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) {
    return next(new ErrorHandler("Only admin access this route", 401));
  }

  next();
};

const socketAutenticator = async (error, socket, next) => {
  try {
    if (error) {
      return next(error);
    }

    const authToken = socket.request.cookies[FUNFUSION_TOKEN];

    if (!authToken) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData._id);

    if (!user) {
      return next(new ErrorHandler("Please login to access this route", 401));
    }

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

export { isAuthenticated, isAdminOnly, socketAutenticator };
