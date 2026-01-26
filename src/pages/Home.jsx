import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { grayColor } from "../constants/color";
const Home = () => {
  return (
    <Box bgcolor={grayColor} height={"100vh"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        {" "}
        Select a friend to chat{" "}
      </Typography>
    </Box>
  );
};
export default Home;
