import { useState } from "react";
import { Box, Container, TextField, Button, Stack } from "@mui/material";
import axios from "../lib/axios";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await axios.get("/sanctum/csrf-cookie", { withCredentials: true });

      await axios.post(
        "/login",
        { email, password },
        { withCredentials: true }
      );

      // Redirect or notify
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #1e3c72, #2a5298)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <AuthFormWrapper title="Login">
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleLogin}
            >
              Login
            </Button>
          </Stack>
        </AuthFormWrapper>
      </Container>
    </Box>
  );
}
