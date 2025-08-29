"use client";

import { useState } from "react";
import { TextInput, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface AddQuizFormProps {
  lessonId: number;
  onCreated?: (quiz: { id: number; title: string; lesson_id: number }) => void;
  opened: boolean;
  onClose?: () => void;
}

export default function AddQuizForm({
  lessonId,
  onCreated,
  onClose,
}: AddQuizFormProps) {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  const handleCreate = async () => {
    if (!title.trim()) {
      notifications.show({
        title: "Missing Title",
        message: "Please enter a quiz title before submitting.",
        color: "orange",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in to create a quiz.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/quizzes", {
        title,
        lesson_id: lessonId,
      });

      notifications.show({
        title: "Quiz Created",
        message: `“${title}” has been successfully added.`,
        color: "teal",
      });

      setTitle("");
      onCreated?.(res.data);
      onClose?.();
    } catch (err: unknown) {
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
