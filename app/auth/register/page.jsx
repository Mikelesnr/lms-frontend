"use client";

import { useState, useEffect } from "react";
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
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";
import { useAuth } from "@/context/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { sanctumPost } = useSanctumRequest();

  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Guarded redirect after login
  useEffect(() => {
    if (user?.role) {
      router.replace(`/dashboard/${user.role}`);
    }
  }, [user?.role, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
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

      router.push("/auth/verify-email");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err?.response?.data?.message || "Invalid input or CSRF mismatch"
      );
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
      <form onSubmit={handleRegister}>
        <Stack>
          <Text size="lg" fw={600}>
            Register
          </Text>

          {error && (
            <Text color="red" size="sm">
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

          <Button fullWidth type="submit" loading={loading}>
            Register
          </Button>

          <Text
            component="a"
            href="/auth/login"
            size="sm"
            ta="center"
            color="blue"
            mt="sm"
            style={{ textDecoration: "underline", cursor: "pointer" }}
          >
            Already have an account? Log in
          </Text>
        </Stack>
      </form>
    </Paper>
  );
}
