import React, { useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const { isAdmin, adminLoader } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const secretKey = useInputValidation("");

  const submitLogin = (e) => {
    e.preventDefault();
    if (!secretKey.value.trim()) {
      alert("Please provide secret key");
      return;
    }
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (adminLoader) {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(to bottom, #68b4eaff, #0e3ae9ff)",
        }}
      >
        <Container
          component="main"
          maxWidth="xs"
          sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        </Container>
      </div>
    );
  }

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #68b4eaff, #0e3ae9ff)",
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
            Admin Login
          </Typography>
          <form
            style={{ width: "100%", marginTop: "1rem" }}
            onSubmit={submitLogin}
          >
            <TextField
              required
              fullWidth
              label="Secret Key"
              type="password"
              margin="normal"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              disabled={adminLoader}
            />
            <Button
              sx={{ marginTop: "1rem" }}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={adminLoader}
            >
              {adminLoader ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
