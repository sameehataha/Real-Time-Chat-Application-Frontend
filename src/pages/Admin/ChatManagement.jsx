import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { server } from "../../constants/config";
import { useAdminFetch } from "../../hooks2/UseAdminFetch";
import LayoutLoader from "../../components/layout/Loaders";
import AvatarCard from "../../components/shared/AvatarCard";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Chat Avatar",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <AvatarCard max={3} avatar={params.row.avatar || []} />
    ),
  },
  {
    field: "name",
    headerName: "Chat Name",
    headerClassName: "table-header",
    width: 250,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => (
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {params.row.groupChat ? (
          <span style={{ color: "green" }}>true</span>
        ) : (
          <span style={{ color: "red" }}>false</span>
        )}
      </Typography>
    ),
  },
  {
    field: "type",
    headerName: "Type",
    headerClassName: "table-header",
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.row.groupChat ? "Group" : "Direct"}
        color={params.row.groupChat ? "primary" : "default"}
        size="small"
      />
    ),
  },
  {
    field: "totalMembers",
    headerName: "Members",
    headerClassName: "table-header",
    width: 120,
    type: "number",
  },
  {
    field: "members",
    headerName: "Member List",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => {
      const memberAvatars = params.row.members?.map((m) => m.avatar) || [];
      return <AvatarCard max={4} avatar={memberAvatars} />;
    },
  },
  {
    field: "totalMessages",
    headerName: "Messages",
    headerClassName: "table-header",
    width: 140,
    type: "number",
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        {params.row.creator?.avatar && params.row.creator?.avatar !== "none" ? (
          <Avatar
            alt={params.row.creator?.name}
            src={params.row.creator?.avatar}
            sx={{ width: 40, height: 40 }}
          />
        ) : (
          <Avatar sx={{ width: 40, height: 40 }}>
            {params.row.creator?.name?.charAt(0) || "?"}
          </Avatar>
        )}
        <Typography variant="body2">
          {params.row.creator?.name || "Unknown"}
        </Typography>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const { loading, data, error } = useAdminFetch(
    `${server}/api/v1/admin/chats`,
  );
  const [rows, setRows] = useState([]);

  console.log("💬 Chats data:", { loading, data, error });

  useEffect(() => {
    if (data && data.chats && Array.isArray(data.chats)) {
      console.log("📊 Transforming chats data:", data.chats);

      const transformedRows = data.chats.map((chat) => ({
        ...chat,
        id: chat._id,
        avatar: chat.avatar || [], // Array of avatar URLs
        members: chat.members || [], // Array of member objects with avatar property
        totalMembers: chat.totalMembers || 0,
        totalMessages: chat.totalMessages || 0,
        creator: chat.creator || { name: "Unknown", avatar: "none" },
      }));

      console.log("✅ Transformed chat rows:", transformedRows);
      setRows(transformedRows);
    }
  }, [data]);

  if (loading) {
    return (
      <AdminLayout>
        <LayoutLoader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <Container component="main" maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              margin: "2rem 0",
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              ❌ Error Loading Chats
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {error}
            </Typography>
            <Typography
              variant="caption"
              display="block"
              sx={{ marginTop: "1rem" }}
            >
              Please try refreshing the page or contact support if the problem
              persists.
            </Typography>
          </Paper>
        </Container>
      </AdminLayout>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <AdminLayout>
        <Container component="main" maxWidth="md">
          <Paper
            elevation={3}
            sx={{
              padding: "2rem",
              margin: "2rem 0",
              borderRadius: "1rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              📭 No Chats Found
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: "0.5rem" }}
            >
              There are no chats in the system yet.
            </Typography>
          </Paper>
        </Container>
      </AdminLayout>
    );
  }

  const groupChatsCount = rows.filter((c) => c.groupChat).length;
  const directChatsCount = rows.filter((c) => !c.groupChat).length;
  const totalMessagesCount = rows.reduce(
    (sum, chat) => sum + (chat.totalMessages || 0),
    0,
  );

  return (
    <AdminLayout>
      <Container component="main" maxWidth="lg" sx={{ paddingY: "2rem" }}>
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h4" gutterBottom>
            💬 Chat Management
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Paper
              elevation={0}
              sx={{
                padding: "0.75rem 1.5rem",
                bgcolor: "rgba(33, 150, 243, 0.1)",
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="body2">
                Total Chats: <strong>{rows.length}</strong>
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                padding: "0.75rem 1.5rem",
                bgcolor: "rgba(76, 175, 80, 0.1)",
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="body2">
                Group Chats: <strong>{groupChatsCount}</strong>
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                padding: "0.75rem 1.5rem",
                bgcolor: "rgba(255, 152, 0, 0.1)",
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="body2">
                Direct Chats: <strong>{directChatsCount}</strong>
              </Typography>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                padding: "0.75rem 1.5rem",
                bgcolor: "rgba(156, 39, 176, 0.1)",
                borderRadius: "0.5rem",
              }}
            >
              <Typography variant="body2">
                Total Messages: <strong>{totalMessagesCount}</strong>
              </Typography>
            </Paper>
          </Stack>
        </Box>
        <Table
          heading={`All Chats (${rows.length})`}
          columns={columns}
          rows={rows}
        />
      </Container>
    </AdminLayout>
  );
};

export default ChatManagement;
