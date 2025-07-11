"use client";

import { useState } from "react";
import { TextInput, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function AddQuizForm({ lessonId, onCreated, opened, onClose }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleCreate = async () => {
    if (!title.trim()) {
      notifications.show({
        title: "Missing Title",
        message: "Please enter a quiz title before submitting.",
        color: "orange",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/api/quizzes",
        { title, lesson_id: lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notifications.show({
        title: "Quiz Created",
        message: `“${title}” has been successfully added.`,
        color: "teal",
      });

      setTitle("");
      onCreated?.(res.data);
      onClose?.();
    } catch (err) {
      console.error("Quiz creation failed:", err);
      notifications.show({
        title: "Creation Failed",
        message: "Could not create quiz. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Group mt="sm">
      <TextInput
        placeholder="Enter quiz title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        w={300}
        aria-label="Quiz Title Input"
      />
      <Button
        onClick={handleCreate}
        loading={loading}
        aria-label="Submit new quiz"
      >
        Create Quiz
      </Button>
    </Group>
  );
}
