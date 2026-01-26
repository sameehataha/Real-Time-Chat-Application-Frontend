import React from "react";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { useState } from "react";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "../utils/validators";
import { server } from "../constants/config";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth-reducer";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLogin = () => setIsLogin((prev) => !prev);
  const name = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const bio = useInputValidation("");
  const password = useStrongPassword();
  const navigate = useNavigate();
  const avatar = useFileHandler("single");
  const dispatch = useDispatch();
  const handleLogin = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        config,
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
      navigate("/");
      // .then((res) =>  console.log(res))
      // .catch((err) => console.log(err))
    } catch (error) {
      toast.error(error?.response?.data?.message || "something went wrong");
    }
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("bio", bio.value);

    const config = {
      withCredentials: true,
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config,
      );
      dispatch(userExists(data.user));
      toast.success(data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(to bottom, #68b4eaff, #0e3ae9ff)",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        maxheight="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
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
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  type="username"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password.value}
                  onChange={password.changeHandler}
                  margin="normal"
                  variant="outlined"
                ></TextField>
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>
                <Button
                  variant="text"
                  onClick={toggleLogin}
                  type="submit"
                  fullWidth
                >
                  SignUp Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleSignup}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  {avatar.error && (
                    <Typography
                      color="error"
                      m={"1rem"}
                      width={"fit-content"}
                      display={"block"}
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAlt />{" "}
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  type="username"
                  margin="normal"
                  variant="outlined"
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  type="username"
                  margin="normal"
                  variant="outlined"
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  type="username"
                  margin="normal"
                  variant="outlined"
                  error={Boolean(username.error)}
                  helperText={username.error}
                ></TextField>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  margin="normal"
                  variant="outlined"
                  error={Boolean(password.error)}
                  helperText={password.error}
                ></TextField>
                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>
                  OR
                </Typography>
                <Button
                  variant="text"
                  onClick={toggleLogin}
                  type="submit"
                  fullWidth
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;