"use client";

import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { LoginCredentials } from "@/types";

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
        return data.message;
      }
      if (
        data?.email &&
        Array.isArray(data.email) &&
        typeof data.email[0] === "string"
      ) {
        return data.email[0];
      }
    }
  }
  return "Network error or server unreachable. Please try again.";
}

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, user, isAuthenticated, loading: authLoading } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const credentials: LoginCredentials = { email, password };
      await login(credentials);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (isAuthenticated && user?.role)) {
    return (
      <Paper
        withBorder
        shadow="sm"
        p="lg"
        radius="md"
        maw={420}
        mx="auto"
        mt="xl"
      >
        <Stack align="center" py="xl">
          <Text size="lg" fw={600}>
            Loading user session...
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      withBorder
      shadow="sm"
      p="lg"
      radius="md"
      maw={420}
      mx="auto"
      mt="xl"
    >
      <form onSubmit={handleLogin}>
        <Stack>
          <Text size="lg" fw={600} ta="center">
            Login
          </Text>

          {error && (
            <Alert color="red" title="Login Error">
              {error}
            </Alert>
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email input field"
            type="email"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password input field"
          />

          <Button
            component={Link}
            href="/auth/forgot-password"
            variant="subtle"
            size="xs"
            color="blue"
            mt="xs"
            style={{ alignSelf: "flex-end" }}
            type="button"
            aria-label="Forgot password link"
          >
            Forgot password?
          </Button>

          <Button
            fullWidth
            type="submit"
            loading={loading}
            aria-label="Submit login"
          >
            Log In
          </Button>

          <Text ta="center" size="sm" mt="sm">
            Don’t have an account?{" "}
            <Anchor component={Link} href="/auth/register" size="sm">
              Sign up
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};

export default LoginPage;
