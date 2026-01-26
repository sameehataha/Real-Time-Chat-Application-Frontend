import { Stack, Avatar, IconButton, Typography } from "@mui/material";
import React, { memo } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { Remove as RemoveIcon } from "@mui/icons-material";
import { ListItem } from "@mui/material";
import { transformImage } from "../../lib/features"
const UserItem = ({ user, handler, handlerIsLoading,isAdded, styling = {} }) => {
  const { name, _id, avatar } = user;
  return (
    <div>
      <ListItem>
        <Stack
          direction={"row"}
          spacing={"1rem"}
          alignItems={"center"}
          width={"100%"}
          {...styling}
        >
          <Avatar  src={transformImage(avatar)}/>
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              WebkitBoxOrient: "vertical",
            }}
          >
            {name}
          </Typography>
          <IconButton
            sx={{
              bgcolor: isAdded ? "error.main" : "primary.main",
              color: "white",
              "&:hover": { bgcolor: isAdded ? "error.dark" : "primary.dark" },
            }}
            onClick={() => handler(_id)}
            disabled={handlerIsLoading}
          >
            {isAdded ? <RemoveIcon /> : <AddIcon />}
          </IconButton>
        </Stack>
      </ListItem>
    </div>
  );
};

export default memo(UserItem);
