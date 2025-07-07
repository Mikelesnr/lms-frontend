// app/auth/verify-email/page.jsx
"use client";
import { useState } from "react";
import { Button, Text, Stack, Paper } from "@mantine/core";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("");

  const resendLink = async () => {
    try {
      const token = Cookies.get("XSRF-TOKEN");
      await api.post(
        "/email/verification-notification",
        {},
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(token),
          },
        }
      );
      setMessage("✅ Verification link resent. Check your inbox!");
    } catch (err) {
      console.error("Resend failed:", err);
      setMessage("⚠️ Failed to resend. Please try again.");
    }
  };

  return (
    <Paper maw={420} mx="auto" mt="xl" p="lg" withBorder shadow="sm">
      <Stack>
        <Text fw={600} size="lg">
          Thanks for signing up!
        </Text>
        <Text>Please verify your email before proceeding.</Text>
        <Button onClick={resendLink}>Resend Verification Email</Button>
        {message && <Text c="blue">{message}</Text>}
      </Stack>
    </Paper>
  );
}
