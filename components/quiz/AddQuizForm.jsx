"use client";
import { useState } from "react";
import { TextInput, Button, Group } from "@mantine/core";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function AddQuizForm({ lessonId, onCreated }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      await api.post(
        "/api/quizzes",
        { title, lesson_id: lessonId },
        {
          headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) },
        }
      );
      setTitle("");
      onCreated();
    } catch (err) {
      console.error("Quiz creation failed", err);
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
