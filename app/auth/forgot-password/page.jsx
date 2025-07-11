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
import api from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleRequest = async (e) => {
    e?.preventDefault();
    setSent(false);
    setError("");

    try {
      await api.post("/api/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to send reset email.";
      setError(msg);
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
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </form>
      )}
    </Card>
  );
}
