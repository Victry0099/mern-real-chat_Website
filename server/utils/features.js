import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOption = {
  maxAge: 1000 * 60 * 60 * 24 * 30,
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "FunFusionChat" })
    .then((data) => {
      console.log(`Connected to DB: ${data.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const sendToken = (res, user, code, message) => {
  // const token = user.getJWTToken();
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  // console.log(token);

  return res.status(code).cookie("funfusion-token", token, cookieOption).json({
    success: true,
    message,
    user,
    // token,
  });
};

const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const userSocket = getSockets(users);
  io.to(userSocket).emit(event, data);

  // console.log("Emitting event", event);
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const base64File = getBase64(file);
      if (!base64File) {
        return reject(new Error("Error converting file to base64"));
      }

      cloudinary.uploader.upload(
        base64File,
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result || !result.public_id || !result.url) {
            return reject(new Error("Invalid response from Cloudinary"));
          }
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.url,
    }));
    // console.log("formattedResults", formattedResults);
    return formattedResults;
  } catch (error) {
    throw new Error("Error uploading files to Cloudinary: " + error.message);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {};

export {
  connectDB,
  sendToken,
  cookieOption,
  emitEvent,
  deleteFilesFromCloudinary,
  uploadFilesToCloudinary,
};
