"use client";

import { Text } from "@mantine/core";
import StandardModal from "../layouts/StandardModal";
import { useState } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function DeleteCourseConfirm({ course, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const { sanctumDelete } = useSanctumRequest();

  if (!course) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sanctumDelete(`/api/courses/${course.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Failed to delete course:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!course}
      onClose={onClose}
      onSubmit={handleDelete}
      title="Delete Course"
      loading={loading}
      submitLabel="Delete"
      submitProps={{ color: "red" }}
    >
      <Text>
        Are you sure you want to delete <strong>{course.title}</strong>? This
        action cannot be undone.
      </Text>
    </StandardModal>
  );
}
