import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";
const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        borderRadius: "5px",
        padding: "0.5rem",
        color: "black",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant={"caption"}>
          {sender?.name}
        </Typography>
      )}
      {content && (
        <Typography style={{ fontSize: "15px" }}>{content}</Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const { url } = attachment;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              {/* RenderAttachment component with correct URL */}
              <a href={url} target="_blank" download style={{ color: "black" }}>
                {<RenderAttachment file={file} url={url} />}
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondry"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
