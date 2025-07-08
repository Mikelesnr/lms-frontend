"use client";

import { useState } from "react";
import { TextInput, Button, Group } from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function AddQuizForm({ lessonId, onCreated, opened, onClose }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { sanctumPost } = useSanctumRequest();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await sanctumPost(`/api/quizzes`, {
        title,
        lesson_id: lessonId,
      });
      setTitle("");
      onCreated?.(res.data);
      onClose?.();
    } catch (err) {
      console.error("Quiz creation failed:", err);
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
        w="300"
      />
      <Button onClick={handleCreate} loading={loading}>
        Create Quiz
      </Button>
    </Group>
  );
}
