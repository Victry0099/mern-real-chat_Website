import moment from "moment";

// ? oldest
// const fileFormat = (url = "") => {
//   const fileExt = url.split(".").pop();

//   if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") {
//     return "video";
//   }

//   if (fileExt === "mp3" || fileExt === "wav") {
//     return "audio";
//   }

//   if (
//     fileExt === "png" ||
//     fileExt === "jpg" ||
//     fileExt === "jpeg" ||
//     fileExt === "gif"
//   ) {
//     return "image";
//   }

//   return "file";
// };

const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop().toLowerCase();

  const fileTypeMap = {
    mp4: "video",
    webm: "video",
    ogg: "video",
    mp3: "audio",
    wav: "audio",
    mpeg: "audio",
    png: "image",
    jpg: "image",
    jpeg: "image",
    gif: "image",
    pdf: "pdf",
    docx: "docx",
  };

  const fileType = fileTypeMap[fileExt];

  if (fileType) {
    return fileType;
  } else {
    const isAudioFile = fileExt.startsWith("audio/");
    const isPdfFile = fileExt === "pdf";
    const isDocxFile = fileExt === "docx";

    if (isAudioFile) {
      return "audio";
    } else if (isPdfFile) {
      return "pdf";
    } else if (isDocxFile) {
      return "docx";
    } else {
      return "file";
    }
  }
};

const transFormImage = (url = "", width = 100) => {
  //  const url = url.replace(/\/(square|small|medium|large)\//, `/w_${width}/`);
  const newUrl = url.replace(
    /\/(square|small|medium|large)\//,
    `upload/dpr_auto/w_${width}/`
  );

  return newUrl;
};

const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");

    last7Days.unshift(dayName);
  }

  return last7Days;
};

const getOrSaveFromLocalStorage = ({ key, value, get }) => {
  if (get) {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export { fileFormat, transFormImage, getLast7Days, getOrSaveFromLocalStorage };
