import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Stack,
  MenuItem,
} from "@mui/material";
import axios from "../lib/axios";
import AuthFormWrapper from "../components/AuthFormWrapper";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const handleRegister = async () => {
    try {
      // await axios.get("/sanctum/csrf-cookie");
      await axios.post("/api/register", form);
      // Redirect or notify
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "linear-gradient(135deg, #1f4037, #99f2c8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <AuthFormWrapper title="Register">
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Registering As"
              select
              fullWidth
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="instructor">Instructor</MenuItem>
              <MenuItem value="student">Student</MenuItem>
            </TextField>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              value={form.password_confirmation}
              onChange={(e) =>
                setForm({ ...form, password_confirmation: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleRegister}
            >
              Register
            </Button>
          </Stack>
        </AuthFormWrapper>
      </Container>
    </Box>
  );
}
