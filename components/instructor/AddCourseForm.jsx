import { useState } from "react";
import { TextInput, Textarea, Button, Paper, Group } from "@mantine/core";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function AddCourseForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Ensure CSRF cookies are set
      // await api.get("/sanctum/csrf-cookie");

      const xsrfToken = Cookies.get("XSRF-TOKEN");

      await api.post(
        "/api/courses",
        { title, description },
        {
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
          },
        }
      );

      setTitle("");
      setDescription("");
      onSuccess(); // trigger refresh
    } catch (err) {
      console.error("Failed to create course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper withBorder p="md" mb="md">
      <TextInput
        label="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Textarea
        label="Description"
        mt="sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Group mt="md">
        <Button onClick={handleSubmit} loading={loading}>
          Create Course
        </Button>
      </Group>
    </Paper>
  );
}
