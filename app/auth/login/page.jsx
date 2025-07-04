"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Get the CSRF cookie
      await api.get("/sanctum/csrf-cookie");

      // Step 2: Grab the token from the cookie
      const xsrfToken = Cookies.get("XSRF-TOKEN");

      // Step 3: Send login request with token in headers
      await api.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
          },
        }
      );

      router.push("/student"); // Redirect after login
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
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
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button fullWidth onClick={handleLogin} loading={loading}>
          Log In
        </Button>
      </Stack>
    </Paper>
  );
}
