"use client";

import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function DeleteLessonConfirm({ lesson, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  if (!lesson) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/lessons/${lesson.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: "Lesson deleted",
        message: `“${lesson.title}” has been removed.`,
        color: "red",
        autoClose: 3000,
      });

      onDeleted?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      notifications.show({
        title: "Deletion failed",
        message: "Could not delete this lesson. Please try again.",
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
      onSubmit={handleDelete}
      title="Delete Lesson"
      loading={loading}
      submitLabel="Delete"
      submitProps={{ color: "red", "aria-label": "Confirm delete" }}
    >
      <Text>
        Are you sure you want to delete <strong>{lesson.title}</strong>? This
        action cannot be undone.
      </Text>
    </StandardModal>
  );
}
