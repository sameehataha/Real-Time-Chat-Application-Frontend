import React from "react";
import { transformImage } from "../../lib/features";
import { FileOpen } from "@mui/icons-material";

const RenderAttchments = (file, url) => {
  console.log("RenderAttchments - file:", file, "url:", url);

  switch (file) {
    case "video":
      return (
        <video 
          src={url} 
          preload="none" 
          width="200px" 
          controls 
          style={{ borderRadius: "8px" }}
        />
      );

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          width="200px"
          height="150px"
          alt="Attachment"
          style={{
            objectFit: "contain",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        />
      );

    case "audio":
      return (
        <audio 
          src={url} 
          preload="none" 
          controls 
          style={{ width: "200px", borderRadius: "4px" }}
        />
      );

    default:
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FileOpen fontSize="small" />
          <span>Download File</span>
        </div>
      );
  }
};

export default RenderAttchments;