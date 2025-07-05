"use client";
import { useEffect, useState } from "react";
import { TextInput, Textarea, NumberInput } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function EditLessonModal({ lesson, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title || "");
      setContent(lesson.content || "");
      setVideoUrl(lesson.video_url || "");
      setOrder(lesson.order || null);
    }
  }, [lesson]);

  const handleUpdate = async () => {
    if (!lesson) return;
    setLoading(true);
    try {
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      await api.put(
        `/api/lessons/${lesson.id}`,
        {
          title,
          content,
          video_url: videoUrl,
          order,
        },
        {
          headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) },
        }
      );
      onSaved();
      onClose();
    } catch (err) {
      console.error("Failed to update lesson:", err);
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
      />
      <TextInput
        label="Video URL"
        mt="sm"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />
      <NumberInput label="Order" mt="sm" value={order} onChange={setOrder} />
    </StandardModal>
  );
}
