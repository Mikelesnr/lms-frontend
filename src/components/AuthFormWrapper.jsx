import { Paper, Stack, Typography } from "@mui/material";

export default function AuthFormWrapper({ title, children }) {
  return (
    <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
      <Stack spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" color="primary" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to LearnSmart LMS
        </Typography>
      </Stack>
      {children}
    </Paper>
  );
}
