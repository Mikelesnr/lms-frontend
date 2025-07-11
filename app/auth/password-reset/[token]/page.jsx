"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
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

export default function ResetPasswordPage({ params: asyncParams }) {
  const params = use(asyncParams); // ✅ unwraps promise in Next.js 15
  const search = useSearchParams();

  const token = params?.token ?? "";

  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = search.get("email") ?? "";
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [search]);

  const handleChange = (field) => (e) => {
    const value = e?.currentTarget?.value ?? "";
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await api.post("/api/auth/reset-password", {
        ...form,
        token,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Reset failed.");
    }
  };

  return (
    <Card maw={400} mx="auto" mt="xl" p="lg">
      <Title order={3} mb="sm">
        Reset Your Password
      </Title>

      {success ? (
        <Notification color="green" withCloseButton={false}>
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
          />

          <PasswordInput
            label="New Password"
            value={form.password}
            onChange={handleChange("password")}
            mt="md"
            required
          />

          <PasswordInput
            label="Confirm Password"
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
            mt="md"
            required
          />

          <Button fullWidth type="submit" mt="lg">
            Reset Password
          </Button>

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </form>
      )}
    </Card>
  );
}
