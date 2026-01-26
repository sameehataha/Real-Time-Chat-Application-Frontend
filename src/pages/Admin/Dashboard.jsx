import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import moment from "moment";

import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyledComponents";

import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import { DoughnutChart, LineChart } from "../../specific/Charts";
import { useAdminFetch } from "../../hooks2/UseAdminFetch";
import { server } from "../../constants/config";
import LayoutLoader from "../../components/layout/Loaders";

const Dashboard = () => {
  const { loading, data, error } = useAdminFetch(
    `${server}/api/v1/admin/stats`,
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Extract stats from data
  const stats = data?.stats || {};
  const {
    userCounts = 0,
    groupCount = 0,
    totalChatCounts = 0,
    messageCounts = 0,
    messagesChart = [0, 0, 0, 0, 0, 0, 0],
  } = stats;

  // Simple search filter - show stats based on search query
  const getFilteredStats = () => {
    const query = searchQuery.toLowerCase();
    const allStats = [
      { title: "Users", value: userCounts, icon: <PersonIcon /> },
      { title: "Chats", value: totalChatCounts, icon: <GroupIcon /> },
      { title: "Messages", value: messageCounts, icon: <MessageIcon /> },
      { title: "Groups", value: groupCount, icon: <GroupIcon /> },
    ];

    if (!query) return allStats;

    // Filter stats by title matching search query
    return allStats.filter((stat) => stat.title.toLowerCase().includes(query));
  };

  const filteredStats = getFilteredStats();

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: "1.5rem",
        margin: "1.5rem 0",
        borderRadius: "1rem",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <AdminPanelSettings />
        <SearchField
          placeholder="Search (Users, Chats, Messages, Groups)..."
          value={searchQuery}
          sx={{
            width: "28rem",
            "& input": {
              fontSize: {
                xs: "0.85rem",
                sm: "0.95rem",
                md: "1rem",
              },
            },
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2">
          {moment().format("MMMM Do YYYY")}
        </Typography>
      </Stack>
    </Paper>
  );

  const DashboardWidgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="space-between"
      margin="2rem 0"
      flexWrap="wrap"
    >
      {filteredStats.length > 0 ? (
        filteredStats.map((stat) => (
          <Widget
            key={stat.title}
            title={stat.title}
            value={stat.value}
            Icon={stat.icon}
          />
        ))
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ width: "100%" }}
        >
          No results found for "{searchQuery}"
        </Typography>
      )}
    </Stack>
  );

  if (loading) return <LayoutLoader />;

  if (error) {
    return (
      <AdminLayout>
        <Container component="main">
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              margin: "2rem 0",
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="error">
              Error loading dashboard data: {error}
            </Typography>
          </Paper>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container component="main">
        {Appbar}

        {/* Only show charts if no search query (default view) */}
        {!searchQuery && (
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            alignItems="stretch"
            justifyContent="center"
          >
            {/* Messages Chart */}
            <Paper
              elevation={3}
              sx={{
                padding: "1.5rem",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: { xs: "100%", md: "50%" },
              }}
            >
              <Typography variant="h5" marginBottom="1rem">
                Last 7 Days Messages
              </Typography>
              <LineChart dataArray={messagesChart} />
            </Paper>

            {/* Chat Type Distribution */}
            <Paper
              elevation={3}
              sx={{
                padding: "1rem",
                borderRadius: "1rem",
                width: "100%",
                maxWidth: { xs: "100%", md: "25rem" },
                height: "25rem",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                dataArray={[totalChatCounts - groupCount, groupCount]}
              />
              <Stack
                position="absolute"
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                width="100%"
                height="100%"
              >
                <GroupIcon fontSize="large" />
                <Typography variant="h6">VS</Typography>
                <PersonIcon fontSize="large" />
              </Stack>
            </Paper>
          </Stack>
        )}

        {DashboardWidgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "1.5rem",
      borderRadius: "1rem",
      minWidth: "10rem",
      textAlign: "center",
      flex: "1 1 auto",
      minHeight: "10rem",
    }}
  >
    <Stack
      alignItems={"center"}
      spacing={"1rem"}
      justifyContent="center"
      height="100%"
    >
      <Typography
        sx={{
          color: "rgba(0,0,0,0.7)",
          borderRadius: "50%",
          border: `5px solid rgba(0,0,0,0.9)`,
          width: "5rem",
          height: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        variant="h5"
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography variant="body2">{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
