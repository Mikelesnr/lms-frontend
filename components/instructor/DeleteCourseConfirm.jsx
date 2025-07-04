"use client";

import { Text } from "@mantine/core";
import api from "@/lib/api";
import StandardModal from "../layouts/StandardModal";
import Cookies from "js-cookie";
import { useState } from "react";

export default function DeleteCourseConfirm({ course, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!course) return null; // ✅ Guard to prevent crash

  const handleDelete = async () => {
    setLoading(true);
    try {
      const xsrfToken = Cookies.get("XSRF-TOKEN");

      await api.delete(`/api/courses/${course.id}`, {
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
      });

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
