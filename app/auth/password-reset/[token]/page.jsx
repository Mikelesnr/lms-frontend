"use client";

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
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function ResetPasswordPage({ params }) {
  const { sanctumPost } = useSanctumRequest();

  const token = params.token;
  const search = useSearchParams();

  const [emailQuery, setEmailQuery] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Populate email from query using useEffect to prevent hydration mismatch
  useEffect(() => {
    const email = search.get("email") || "";
    setEmailQuery(email);
    setForm((prev) => ({ ...prev, email }));
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError("");

    try {
      await sanctumPost("/api/auth/reset-password", {
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
        <Notification color="green">
          Password reset successful! You may now log in.
        </Notification>
      ) : (
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
            required
          />

          <PasswordInput
            label="New Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.currentTarget.value })
            }
            mt="md"
            required
          />

          <PasswordInput
            label="Confirm Password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({
                ...form,
                password_confirmation: e.currentTarget.value,
              })
            }
            mt="md"
            required
          />

          <Button fullWidth type="submit" mt="lg">
            Reset Password
          </Button>

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </form>
      )}
    </Card>
  );
}
