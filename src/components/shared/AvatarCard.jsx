import React from "react";
import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import { transformImage } from "../../lib/features";
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction="row" spacing={0.5}>
      <AvatarGroup max={max} sx={{ flexDirection: "row" }}>
        <Box  width={"3.5rem"} 
          height={"2rem"} position="relative"  sx={{ minWidth: "3.5rem", margin: "auto" }}>
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
               
              sx={{
                width: "2rem",
                height: "2rem",
                position: "absolute",
                left: {
                  xs: `${index * 1.5}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
