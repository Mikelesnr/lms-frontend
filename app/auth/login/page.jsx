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
import { useRouter } from "next/navigation";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { sanctumPost } = useSanctumRequest();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await sanctumPost("/api/auth/login", {
        email,
        password,
      });

      const role = response.data.role;
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "instructor") {
        router.push("/dashboard/instructor");
      } else {
        router.push("/dashboard/student");
      }
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
