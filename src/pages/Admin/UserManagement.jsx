import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Container, Paper, Typography, Box } from "@mui/material";
import { transformImage } from "../../lib/features";
import { server } from "../../constants/config";
import { useAdminFetch } from "../../hooks2/UseAdminFetch";
import LayoutLoader from "../../components/layout/Loaders";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar
        alt={params.row.name}
        src={params.row.avatar}
        sx={{ width: 40, height: 40 }}
      />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
    type: "number",
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
    type: "number",
  },
];

const UserManagement = () => {
  const { loading, data, error } = useAdminFetch(
    `${server}/api/v1/admin/users`,
  );
  const [rows, setRows] = useState([]);

  console.log("Users data:", { loading, data, error });

  useEffect(() => {
    if (data && data.users && Array.isArray(data.users)) {
      console.log(" Transforming users data:", data.users);

      const transformedRows = data.users.map((user) => ({
        ...user,
        id: user._id,
        avatar: user.avatar || "", // Handle missing avatar
      }));

      console.log("Transformed rows:", transformedRows);
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
              Error Loading Users
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
              No Users Found
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ marginTop: "0.5rem" }}
            >
              There are no users in the system yet.
            </Typography>
          </Paper>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Container component="main" maxWidth="lg" sx={{ paddingY: "2rem" }}>
        <Box sx={{ marginBottom: "2rem" }}>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Users: <strong>{rows.length}</strong>
          </Typography>
        </Box>
        <Table
          heading={`All Users (${rows.length})`}
          columns={columns}
          rows={rows}
        />
      </Container>
    </AdminLayout>
  );
};

export default UserManagement;
