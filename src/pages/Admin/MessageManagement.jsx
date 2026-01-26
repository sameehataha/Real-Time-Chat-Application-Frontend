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
  Tooltip,
} from "@mui/material";
import { server } from "../../constants/config";
import { useAdminFetch } from "../../hooks2/UseAdminFetch";
import LayoutLoader from "../../components/layout/Loaders";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "../../components/shared/RenderAttchments";
import moment from "moment";

const columns = [
  {
    field: "id",
    headerName: "Message ID",
    headerClassName: "table-header",
    width: 180,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      if (!attachments || attachments.length === 0) {
        return (
          <Typography variant="caption" color="textSecondary">
            No Attachments
          </Typography>
        );
      }

      return (
        <Stack spacing={0.5}>
          {attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);
            return (
              <Box key={attachment.public_id || index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })}
        </Stack>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 350,
    renderCell: (params) => (
      <Tooltip title={params.row.content || "No content"}>
        <Typography
          variant="body2"
          noWrap
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {params.row.content || "(No text content)"}
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        {params.row.sender?.avatar ? (
          <Avatar
            alt={params.row.sender?.name}
            src={params.row.sender?.avatar}
            sx={{ width: 36, height: 36 }}
          />
        ) : (
          <Avatar sx={{ width: 36, height: 36 }}>
            {params.row.sender?.name?.charAt(0) || "?"}
          </Avatar>
        )}
        <Typography variant="body2">
          {params.row.sender?.name || "Unknown"}
        </Typography>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat ID",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.row.chat}>
        <Typography variant="caption" sx={{ fontFamily: "monospace" }}>
          {params.row.chat?.substring(0, 12)}...
        </Typography>
      </Tooltip>
    ),
  },
  {
    field: "groupChat",
    headerName: "Chat Type",
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
    field: "createdAt",
    headerName: "Sent At",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={new Date(params.row.createdAtOriginal).toLocaleString()}>
        <Typography variant="body2">{params.row.createdAt}</Typography>
      </Tooltip>
    ),
  },
];

const MessageManagement = () => {
  const { loading, data, error } = useAdminFetch(
    `${server}/api/v1/admin/messages`,
  );
  const [rows, setRows] = useState([]);

  console.log(" Messages data:", { loading, data, error });

  useEffect(() => {
    if (data && data.messages && Array.isArray(data.messages)) {
      console.log(" Transforming messages data:", data.messages);

      const transformedRows = data.messages.map((message) => ({
        ...message,
        id: message._id,
        sender: {
          name: message.sender?.name || "Unknown",
          avatar:
            message.sender?.avatar ||
            "https://www.w3schools.com/howto/img_avatar.png",
        },
        attachments: message.attachments || [],
        content: message.content || "(No text content)",
        chat: message.chat || "Unknown",
        groupChat: message.groupChat || false,
        createdAt: moment(message.createdAt).format("MMM Do YYYY, h:mm a"),
        createdAtOriginal: message.createdAt,
      }));

      console.log("Transformed message rows:", transformedRows);
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
              Error Loading Messages
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
              No Messages Found
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: "0.5rem" }}
            >
              There are no messages in the system yet.
            </Typography>
          </Paper>
        </Container>
      </AdminLayout>
    );
  }

  const totalAttachments = rows.reduce(
    (sum, msg) => sum + (msg.attachments?.length || 0),
    0,
  );
  const groupMessages = rows.filter((m) => m.groupChat).length;
  const directMessages = rows.filter((m) => !m.groupChat).length;

  return (
    <AdminLayout>
      <Container component="main" maxWidth="lg" sx={{ paddingY: "2rem" }}>
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h4" gutterBottom>
            Message Management
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
                Total Messages: <strong>{rows.length}</strong>
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
                Group Messages: <strong>{groupMessages}</strong>
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
                Direct Messages: <strong>{directMessages}</strong>
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
                Total Attachments: <strong>{totalAttachments}</strong>
              </Typography>
            </Paper>
          </Stack>
        </Box>
        <Table
          heading={`All Messages (${rows.length})`}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      </Container>
    </AdminLayout>
  );
};

export default MessageManagement;
