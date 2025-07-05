"use client";
import { Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { useState } from "react";

export default function DeleteLessonConfirm({ lesson, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!lesson) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      await api.delete(`/api/lessons/${lesson.id}`, {
        headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) },
      });
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete lesson:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!lesson}
      onClose={onClose}
      onSubmit={handleDelete}
      title="Delete Lesson"
      loading={loading}
      submitLabel="Delete"
      submitProps={{ color: "red" }}
    >
      <Text>
        Are you sure you want to delete <strong>{lesson.title}</strong>? This
        action cannot be undone.
      </Text>
    </StandardModal>
  );
}
