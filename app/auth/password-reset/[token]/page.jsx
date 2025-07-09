"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
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
  const token = params.token;
  const search = useSearchParams();
  const emailFromQuery = search.get("email");

  const { sanctumPost } = useSanctumRequest();

  const [form, setForm] = useState({
    email: emailFromQuery || "",
    password: "",
    password_confirmation: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await sanctumPost("/api/auth/reset-password", {
        ...form,
        token,
      });
      setSuccess(true);
      setError("");
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
        <>
          <TextInput
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.currentTarget.value })}
          />
          <PasswordInput
            label="New Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.currentTarget.value })
            }
            mt="md"
          />
          <PasswordInput
            label="Confirm Password"
            value={form.password_confirmation}
            onChange={(e) =>
              setForm({ ...form, password_confirmation: e.currentTarget.value })
            }
            mt="md"
          />
          <Button fullWidth mt="lg" onClick={handleSubmit}>
            Reset Password
          </Button>
          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}
        </>
      )}
    </Card>
  );
}
