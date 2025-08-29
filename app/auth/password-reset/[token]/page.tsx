"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Card,
  Title,
  Text,
  Notification,
} from "@mantine/core";
import api from "@/lib/api";

interface ResetPasswordForm {
  email: string;
  password: string;
  password_confirmation: string;
}

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
    }
  }
  return "Reset failed. Please try again.";
}

export default function ResetPasswordPage() {
  const search = useSearchParams();
  const params = useParams();
  const token = typeof params?.token === "string" ? params.token : "";

  const [form, setForm] = useState<ResetPasswordForm>({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const email = search.get("email") ?? "";
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [search]);

  const handleChange =
    (field: keyof ResetPasswordForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await api.post("/api/auth/reset-password", {
        ...form,
        token,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <Card maw={400} mx="auto" mt="xl" p="lg" radius="md">
      <Title order={3} mb="sm" ta="center">
        Reset Your Password
      </Title>

      {success ? (
        <Notification color="green" withCloseButton={false} radius="md">
          <div>
            Password reset successful! You may now log in.
            <Button
              size="xs"
              variant="light"
              mt="sm"
              onClick={() => (window.location.href = "/auth/login")}
            >
              Go to Login
            </Button>
          </div>
        </Notification>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            value={form.email}
            onChange={handleChange("email")}
            required
            type="email"
            aria-label="Email for password reset"
          />

          <PasswordInput
            label="New Password"
            value={form.password}
            onChange={handleChange("password")}
            mt="md"
            required
            aria-label="New password"
          />

          <PasswordInput
            label="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
            mt="md"
            required
            aria-label="Confirm new password"
          />

          <Button fullWidth type="submit" mt="lg" radius="md">
            Reset Password
          </Button>

          {error && (
            <Text c="red" size="sm" mt="sm" ta="center">
              {error}
            </Text>
          )}
        </form>
      )}
    </Card>
  );
}
