"use client";

import { useState } from "react";
import { TextInput, Textarea, Button, NumberInput } from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function AddLessonForm({ courseId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const { sanctumPost } = useSanctumRequest();

  const handleCreate = async () => {
    setLoading(true);
    try {
      await sanctumPost("/api/lessons", {
        course_id: courseId,
        title,
        content,
        video_url: videoUrl,
        order,
      });

      onSuccess();
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
    <>
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
        mt="sm"
      />
      <TextInput
        label="Video URL"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        mt="sm"
      />
      <NumberInput label="Order" value={order} onChange={setOrder} mt="sm" />
      <Button onClick={handleCreate} mt="md" loading={loading}>
        Add Lesson
      </Button>
    </>
  );
}
