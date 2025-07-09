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
import { useAuth } from "@/context/useAuth";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function LoginPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { sanctumPost } = useSanctumRequest();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Redirect if already logged in
  useEffect(() => {
    if (user?.role) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await sanctumPost("/api/auth/login", {
        email,
        password,
      });

      const { user } = response.data;
      setUser(user);

      const rolePath = `/dashboard/${user.role || "student"}`;
      router.push(rolePath);
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

        <Button
          variant="subtle"
          size="xs"
          color="blue"
          mt="xs"
          onClick={() => router.push("/auth/forgot-password")}
          style={{ alignSelf: "flex-end" }}
        >
          Forgot password?
        </Button>

        <Button fullWidth onClick={handleLogin} loading={loading}>
          Log In
        </Button>

        <Text
          component="a"
          href="/auth/register"
          size="sm"
          ta="center"
          c="blue"
          mt="sm"
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Don’t have an account? Sign up
        </Text>
      </Stack>
    </Paper>
  );
}
