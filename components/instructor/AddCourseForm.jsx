"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, Paper, Group } from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function AddCourseForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await api.post(
        "/api/courses",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      onSuccess?.(); // trigger refresh if provided
    } catch (err) {
      console.error("Failed to create course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder p="md" mb="md">
      <TextInput
        label="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Description"
        mt="sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Group mt="md">
        <Button onClick={handleSubmit} loading={loading}>
          Create Course
        </Button>
      </Group>
    </Paper>
  );
}
