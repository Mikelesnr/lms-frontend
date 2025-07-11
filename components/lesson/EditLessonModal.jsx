"use client";

import { useEffect, useState } from "react";
import { TextInput, Textarea, NumberInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function EditLessonModal({ lesson, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setContent(lesson.content || "");
      setVideoUrl(lesson.video_url || "");
      setOrder(lesson.order || null);
    }
  }, [lesson]);

  const handleUpdate = async () => {
    if (!lesson || !token) return;
    setLoading(true);
    try {
      await api.put(
        `/api/lessons/${lesson.id}`,
        { title, content, video_url: videoUrl, order },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      notifications.show({
        title: "Lesson updated",
        message: `“${title}” has been successfully updated.`,
        color: "teal",
        autoClose: 3000,
      });

      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update lesson:", err);
      notifications.show({
        title: "Update failed",
        message: "Could not update this lesson. Please try again.",
        color: "orange",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!lesson}
      onClose={onClose}
      onSubmit={handleUpdate}
      title="Edit Lesson"
      loading={loading}
      submitProps={{ "aria-label": "Save lesson changes" }}
    >
      <TextInput
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        label="Content"
        mt="sm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        minRows={4}
      />
      <TextInput
        label="Video URL"
        mt="sm"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <NumberInput
        label="Order"
        mt="sm"
        value={order}
        onChange={setOrder}
        min={1}
        allowDecimal={false}
      />
    </StandardModal>
  );
}
