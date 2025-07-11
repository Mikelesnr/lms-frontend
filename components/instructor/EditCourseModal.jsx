"use client";

import { useEffect, useState } from "react";
import { TextInput, Textarea } from "@mantine/core";
import StandardModal from "../layouts/StandardModal";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function EditCourseModal({ course, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuthStore();

  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setDescription(course.description || "");
    }
  }, [course]);

  const handleUpdate = async () => {
    if (!course) return;
    setLoading(true);

    try {
      await api.put(
        `/api/courses/${course.id}`,
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!course}
      onClose={onClose}
      onSubmit={handleUpdate}
      title="Edit Course"
      loading={loading}
    >
      <TextInput
        label="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        label="Description"
        mt="sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        minRows={4}
      />
    </StandardModal>
  );
}
