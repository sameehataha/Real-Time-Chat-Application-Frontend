import moment from "moment";

const fileFormat = (url = "") => {
  if (!url) return "file";

  const fileExt = url.split(".").pop().toLowerCase().split("?")[0];

  // Video formats
  if (
    fileExt === "mp4" ||
    fileExt === "webm" ||
    fileExt === "ogg" ||
    fileExt === "mov" ||
    fileExt === "avi" ||
    fileExt === "mkv"
  ) {
    return "video";
  }

  // Audio formats
  if (
    fileExt === "mp3" ||
    fileExt === "wav" ||
    fileExt === "aac" ||
    fileExt === "m4a" ||
    fileExt === "flac" ||
    fileExt === "wma"
  ) {
    return "audio";
  }

  // Image formats
  if (
    fileExt === "png" ||
    fileExt === "jpeg" ||
    fileExt === "jpg" ||
    fileExt === "gif" ||
    fileExt === "webp" ||
    fileExt === "bmp" ||
    fileExt === "svg"
  ) {
    return "image";
  }

  return "file";
};

/**
 * Transform image URL for optimization (if using Cloudinary)
 * Handles string URLs and array of URLs
 */
const transformImage = (url = "", width = 100) => {
  // Handle null/undefined
  if (!url) return "";

  // If it's an array (like avatar arrays), take the first element
  if (Array.isArray(url)) {
    url = url[0];
  }

  // If it's an object, try to get url property
  if (typeof url === "object") {
    url = url?.url || url?.secure_url || "";
  }

  // If still not a string, return empty
  if (typeof url !== "string") {
    console.warn("transformImage received invalid URL:", url);
    return "";
  }

  try {
    // Apply Cloudinary transformation if it's a Cloudinary URL
    if (url.includes("cloudinary")) {
      const newUrl = url.replace("upload/", `upload/dpr_auto,w_${width}/`);
      return newUrl;
    }

    // Return original URL if not Cloudinary
    return url;
  } catch (error) {
    console.error("Error transforming image:", error);
    return url; // Return original URL on error
  }
};

// Get last 7 days for chart/graph
const getLast7Days = () => {
  const currentDate = moment();
  const last7Days = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const dayName = dayDate.format("dddd");
    const dayNumber = dayDate.format("DD");
    last7Days.unshift(dayName, dayNumber);
  }

  return last7Days;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get) {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export { fileFormat, transformImage, getLast7Days, getOrSaveFromStorage };