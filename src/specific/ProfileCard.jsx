import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import {
  Person as PersonIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../lib/features";
import { navyblue } from "../constants/color";
const ProfileCard = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <Profile heading={"Bio"} text={user?.bio} />
      <Profile
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />
      <Profile heading={"Name"} text={user?.name} Icon={<PersonIcon />} />
      <Profile
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};
const Profile = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}
    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"navyblue"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default ProfileCard;
