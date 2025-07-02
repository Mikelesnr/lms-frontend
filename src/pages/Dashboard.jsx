import { Container, Typography, Button, Stack } from "@mui/material";
import axios from "../lib/axios";

export default function Dashboard() {
  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      window.location.href = "/login"; // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={600}>
          Welcome to your Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You're logged in! 🎉
        </Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Stack>
    </Container>
  );
}
