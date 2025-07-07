"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Text,
  Select,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest"; // 🆕 import the hook

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { sanctumPost } = useSanctumRequest();

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      await sanctumPost("/api/auth/register", {
        name,
        email,
        password,
        role,
        password_confirmation: passwordConfirmation,
      });

      router.push("/auth/verify-email"); // 🔁 verification prompt
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

        <Select
          label="Role"
          data={[
            { value: "student", label: "Student" },
            { value: "instructor", label: "Instructor" },
          ]}
          value={role}
          onChange={setRole}
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
