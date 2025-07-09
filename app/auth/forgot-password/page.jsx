"use client";

import { useState } from "react";
import {
  TextInput,
  Button,
  Card,
  Title,
  Text,
  Notification,
} from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { sanctumPost } = useSanctumRequest();

  const handleRequest = async () => {
    try {
      await sanctumPost("/api/auth/forgot-password", { email });
      setSent(true);
      setError("");
    } catch (err) {
      setSent(false);
      setError(err?.response?.data?.message || "Failed to send reset email.");
    }
  };

  return (
    <Card maw={400} mx="auto" mt="xl" p="lg">
      <Title order={3} mb="sm">
        Forgot Password
      </Title>
      {sent ? (
        <Notification color="green">
          Reset link sent to your email.
        </Notification>
      ) : (
        <>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
          <Button fullWidth mt="md" onClick={handleRequest}>
            Send Reset Link
          </Button>
          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </>
      )}
    </Card>
  );
}
