"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  NumberInput,
  Stack,
  Paper,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lesson } from "@/types";

interface AddLessonFormProps {
  courseId: number;
  onSuccess?: (newLesson?: Lesson) => void;
}

export default function AddLessonForm({
  courseId,
  onSuccess,
}: AddLessonFormProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [order, setOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  const handleCreate = async () => {
    if (!isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to add lessons.",
        color: "red",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      notifications.show({
        title: "Missing Fields",
        message: "Lesson title and content are required.",
        color: "orange",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<Lesson>("/api/lessons", {
        course_id: courseId,
        title,
        content,
        video_url: videoUrl,
        order,
      });

      notifications.show({
        title: "Lesson Added",
        message: `"${title}" has been successfully added.`,
        color: "teal",
      });

      onSuccess?.(res.data);
      setTitle("");
      setContent("");
      setVideoUrl("");
      setOrder(null);
    } catch (err: unknown) {
      console.error("Failed to add lesson:", err);

      let message = "Could not add this lesson. Please try again.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object"
      ) {
        const response = (err as { response?: { data?: unknown } }).response;
        if (
          response &&
          "data" in response &&
          typeof response.data === "object" &&
          response.data !== null &&
          "message" in response.data &&
          typeof (response.data as { message?: unknown }).message === "string"
        ) {
          message = (response.data as { message: string }).message;
        }
      }

      notifications.show({
        title: "Creation Failed",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <TextInput
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-label="Lesson Title input field"
        />
        <Textarea
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          minRows={4}
          aria-label="Lesson Content textarea"
        />
        <TextInput
          label="Video URL (Optional)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          aria-label="Lesson Video URL input field"
        />
        <NumberInput
          label="Order"
          value={order ?? undefined}
          onChange={(value) => {
            if (typeof value === "number") {
              setOrder(value);
            } else if (value === "") {
              setOrder(null);
            }
          }}
          min={1}
          allowDecimal={false}
          placeholder="e.g., 1"
          aria-label="Lesson Order number input field"
        />
        <Group justify="flex-end" mt="md">
          <Button
            onClick={handleCreate}
            loading={loading}
            aria-label="Add lesson"
          >
            Add Lesson
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
