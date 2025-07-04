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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      await api.get("/sanctum/csrf-cookie"); // 🍪 sets XSRF-TOKEN + session cookie

      const xsrfToken = Cookies.get("XSRF-TOKEN");
      console.log("CSRF Token (from cookie):", xsrfToken);

      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
          },
        }
      );

      router.push("/dashboard");
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Invalid input or CSRF mismatch");
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
      maw={480}
      mx="auto"
      mt="xl"
    >
      <Stack>
        <Text size="lg" fw={600}>
          Register
        </Text>

        {error && (
          <Text c="red" size="sm">
            {error}
          </Text>
        )}

        <TextInput
          label="Name"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <TextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <PasswordInput
          label="Confirm Password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />

        <Button fullWidth onClick={handleRegister} loading={loading}>
          Register
        </Button>
      </Stack>
    </Paper>
  );
}
