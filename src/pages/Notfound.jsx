import { Error } from "@mui/icons-material";
import { Typography, Container, Stack, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        alignItems="center"
        spacing={3}
        justifyContent="center"
        sx={{
          height: "100%",
          textAlign: "center",
        }}
      >
        <Error
          sx={{
            fontSize: "10rem",
            color: "error.main",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            fontWeight: 700,
            color: "textPrimary",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h3"
          sx={{
            color: "textSecondary",
            marginBottom: "1rem",
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "textSecondary",
            marginBottom: "2rem",
          }}
        >
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            padding: "0.75rem 2rem",
          }}
        >
          Go Back to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default Notfound;
