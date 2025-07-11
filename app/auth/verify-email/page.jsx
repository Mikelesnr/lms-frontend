"use client";

import { useState } from "react";
import { Button, Text, Stack, Paper } from "@mantine/core";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/stores/useAuthStore";

export default function VerifyEmailPage() {
  const [message, setMessage] = useState("");
  const { token } = useAuthStore();

  const resendLink = async () => {
    setMessage("");

    // ✅ Prevent unauthenticated requests during hydration
    if (!token || typeof token !== "string") {
      setMessage("⚠️ Token missing. Please log in before resending.");
      return;
    }

    try {
      await api.post("/api/auth/email/verification-notification", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        {message && (
          <Text c={message.includes("✅") ? "green" : "red"}>{message}</Text>
        )}
      </Stack>
    </Paper>
  );
}
