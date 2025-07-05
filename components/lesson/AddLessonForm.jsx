import { useState } from "react";
import { TextInput, Textarea, Button, NumberInput } from "@mantine/core";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function AddLessonForm({ courseId, onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await api.get("/sanctum/csrf-cookie");
      const xsrfToken = Cookies.get("XSRF-TOKEN");

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
          headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) },
        }
      );

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
