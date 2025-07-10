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

  const handleRequest = async (e) => {
    e?.preventDefault();

    setSent(false);
    setError("");

    try {
      await sanctumPost("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
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
        <form onSubmit={handleRequest}>
          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
          />

          <Button fullWidth type="submit" mt="md">
            Send Reset Link
          </Button>

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </form>
      )}
    </Card>
  );
}
