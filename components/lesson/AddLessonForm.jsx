"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  NumberInput,
  Stack,
  Paper,
} from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function AddLessonForm({ courseId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.post(
        "/api/lessons",
        {
          course_id: courseId,
          title,
          content,
          video_url: videoUrl,
          order,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onSuccess?.();
      setTitle("");
      setContent("");
      setVideoUrl("");
      setOrder(null);
    } catch (err) {
      console.error("Failed to add lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Stack spacing="sm">
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TextInput
          label="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <NumberInput
          label="Order"
          value={order}
          onChange={setOrder}
          min={1}
          allowDecimal={false}
        />
        <Button onClick={handleCreate} loading={loading}>
          Add Lesson
        </Button>
      </Stack>
    </Paper>
  );
}
