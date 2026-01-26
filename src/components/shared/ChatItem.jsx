import React, { memo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "../styles/StyledComponents";
import AvatarCard from "./AvatarCard";
import { blue } from "../../constants/color"

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      sx={{ padding: "0" }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: sameSender ? "blue " : "unset",
          color: sameSender ? "white" : "unset",
          gap: "1rem",
          position: "relative",
          "&:hover": { bgcolor: "rgba(22, 153, 241, 0.1)" },
        }}
      >
        {/* Avatar */}
        <AvatarCard avatar={avatar} />

        {/* Chat Name and Status */}
        <Stack sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <Typography sx={{ fontWeight: sameSender ? 600 : 400 }}>
              {name}
            </Typography>

            {/* Online Status - Text with Blue Dot */}
            {isOnline && (
              <Box sx={{ display: "flex", alignItems: "center", gap: "0.35rem",backgroundColor:"lightblue",borderRadius:"0.5rem",padding:"0.25rem 0.5rem"}}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#007FFF",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                >
                  online:
                </Typography>
                <Box
                  sx={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#007FFF",
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { boxShadow: "0 0 6px rgba(0,127,255,0.6)" },
                      "50%": { boxShadow: "0 0 12px rgba(0,127,255,0.8)" },
                      "100%": { boxShadow: "0 0 6px rgba(0,127,255,0.6)" }
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          {/* New Message Alert */}
          {newMessageAlert && (
            <Typography variant="caption" color="primary">
              {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? "s" : ""}
            </Typography>
          )}
        </Stack>
      </Box>
    </Link>
  );
};

export default memo(ChatItem);