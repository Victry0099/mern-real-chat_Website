import React from "react";
import { transFormImage } from "../../lib/features";
import {
  FileOpen as FileOpenIcon,
  PictureAsPdf as PdfIcon,
  Description as DocxIcon,
  InsertDriveFile as DocIcon,
} from "@mui/icons-material";

const RenderAttachment = ({ file, url }) => {
  // console.log("File type:", file);

  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={transFormImage(url, 200)}
          alt="Attachment"
          width={"200px"}
          height={"150px"}
          style={{
            objectFit: "contain",
            borderRadius: "10px",
          }}
        />
      );

    case "audio":
      return <audio src={url} preload="none" controls />;

    case "pdf":
      return <PdfIcon style={{ fontSize: 20, color: "red" }} />;

    case "docx":
      return <DocxIcon style={{ fontSize: 20, color: "blue" }} />;

    case "doc":
      return <DocIcon style={{ fontSize: 20, color: "green" }} />;

    default:
      return <FileOpenIcon />;
  }
};

export default RenderAttachment;
