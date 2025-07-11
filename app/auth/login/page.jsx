"use client";

import { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import { notifications } from "@mantine/notifications";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, token, setUser, setToken } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (user?.role && !hasRedirected) {
      router.replace(`/dashboard/${user.role}`);
      setHasRedirected(true);
    }
  }, [user?.role, hasRedirected, router]);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { user: loggedInUser, token: accessToken } = response.data;

      if (loggedInUser?.role && accessToken) {
        setUser(loggedInUser);
        setToken(accessToken);

        notifications.show({
          title: "Welcome Back",
          message: `Logged in as ${loggedInUser.name || loggedInUser.email}`,
          color: "teal",
        });

        router.push(`/dashboard/${loggedInUser.role}`);
        setHasRedirected(true);
      } else {
        setError("Login succeeded but role or token was missing.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials or server error.");
      notifications.show({
        title: "Login Failed",
        message: "Invalid credentials or server error.",
        color: "red",
      });
    } finally {
      setProcessing(false);
    }
  };

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
          <Text size="lg" fw={600}>
            Login
          </Text>

          {error && (
            <Text c="red" size="sm">
              {error}
            </Text>
          )}

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email input field"
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
            variant="subtle"
            size="xs"
            color="blue"
            mt="xs"
            onClick={() => router.push("/auth/forgot-password")}
            style={{ alignSelf: "flex-end" }}
            type="button"
            aria-label="Forgot password link"
          >
            Forgot password?
          </Button>

          <Button
            fullWidth
            type="submit"
            loading={processing}
            aria-label="Submit login"
          >
            Log In
          </Button>

          <Text
            component="a"
            href="/auth/register"
            size="sm"
            align="center"
            color="blue"
            mt="sm"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            aria-label="Registration link"
          >
            Don’t have an account? Sign up
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
