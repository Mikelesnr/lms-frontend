"use client";

import { Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function DeleteLessonConfirm({ lesson, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const { sanctumDelete } = useSanctumRequest();

  if (!lesson) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sanctumDelete(`/api/lessons/${lesson.id}`);
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
