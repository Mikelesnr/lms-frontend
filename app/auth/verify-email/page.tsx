"use client";

import { useState } from "react";
import { Button, Text, Stack, Paper } from "@mantine/core";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const response = (err as { response?: { data?: unknown } }).response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      typeof (response as { data?: unknown }).data === "object"
    ) {
      const data = (response as { data?: Record<string, unknown> }).data;
      if (data?.message && typeof data.message === "string") {
        return `⚠️ ${data.message}`;
      }
    }
  }
  return "⚠️ Failed to resend. Please try again.";
}

export default function VerifyEmailPage() {
  const [message, setMessage] = useState<string>("");
  const { isAuthenticated, loading: authLoading } = useAuth();

  const resendLink = async () => {
    setMessage("");

    if (authLoading) {
      setMessage("⚠️ Authentication still loading. Please wait.");
      return;
    }
    if (!isAuthenticated) {
      setMessage("⚠️ Not authenticated. Please log in before resending.");
      return;
    }

    try {
      await api.post("/api/auth/email/verification-notification");
      setMessage("✅ Verification link resent. Check your inbox!");
    } catch (err: unknown) {
      console.error("Resend failed:", err);
      setMessage(extractErrorMessage(err));
    }
  };

  return (
    <Paper
      maw={420}
      mx="auto"
      mt="xl"
      p="lg"
      withBorder
      shadow="sm"
      radius="md"
    >
      <Stack align="center">
        <Text fw={600} size="lg" ta="center">
          Thanks for signing up! 🎉
        </Text>
        <Text ta="center">Please verify your email before proceeding.</Text>
        <Button onClick={resendLink} radius="md" loading={authLoading}>
          Resend Verification Email
        </Button>
        {message && (
          <Text c={message.includes("✅") ? "green" : "red"} ta="center">
            {message}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
