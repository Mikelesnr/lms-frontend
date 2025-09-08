"use client";

import React, { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Button,
  Stack,
  Text,
  Select,
  Anchor,
  Alert,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { RegisterData } from "@/types";

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
        data?.errors &&
        typeof data.errors === "object" &&
        data.errors !== null
      ) {
        const firstError = Object.values(data.errors).flat()[0];
        if (typeof firstError === "string") return firstError;
      }
    }
  }
  return "Network error or server unreachable. Please try again.";
}

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { register, user, isAuthenticated, loading: authLoading } = useAuth();

  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("student");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [authLoading, isAuthenticated, user?.role, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData: RegisterData = {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: role as "admin" | "instructor" | "student",
      };
      await register(userData);
      router.push("/auth/login");
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
        maw={480}
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
      maw={480}
      mx="auto"
      mt="xl"
    >
      <form onSubmit={handleRegister}>
        <Stack>
          <Text size="lg" fw={600} ta="center">
            Register
          </Text>

          {error && (
            <Alert color="red" title="Registration Error">
              {error}
            </Alert>
          )}

          <TextInput
            label="Name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Name input field"
          />

          <TextInput
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            aria-label="Email input field"
          />

          <Select
            label="Role"
            data={[
              { value: "student", label: "Student" },
              { value: "instructor", label: "Instructor" },
            ]}
            value={role}
            onChange={(value) => setRole(value ?? "student")}
            required
            aria-label="Role selection"
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password input field"
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
            aria-label="Confirm password input field"
          />

          <Button
            fullWidth
            type="submit"
            loading={loading}
            aria-label="Submit registration"
          >
            Register
          </Button>

          <Text ta="center" size="sm" mt="sm">
            Already have an account?{" "}
            <Anchor component={Link} href="/auth/login" size="sm">
              Log in
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Paper>
  );
};

export default RegisterPage;
