"use client";

import { Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { Course } from "@/types";

interface DeleteCourseConfirmProps {
  course: Course | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteCourseConfirm({
  course,
  onClose,
  onDeleted,
}: DeleteCourseConfirmProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  if (!course) return null;

  const handleDelete = async () => {
    if (!isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to delete courses.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/api/courses/${course.id}`);

      notifications.show({
        title: "Course Deleted",
        message: `"${course.title || "Untitled Course"}" has been removed.`,
        color: "red",
        autoClose: 3000,
      });

      onDeleted();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to delete course:", err);

      let message = "Could not delete this course. Please try again.";

      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object"
      ) {
        const response = (err as { response?: { data?: unknown } }).response;
        if (
          response &&
          "data" in response &&
          typeof response.data === "object" &&
          response.data !== null &&
          "message" in response.data &&
          typeof (response.data as { message?: unknown }).message === "string"
        ) {
          message = (response.data as { message: string }).message;
        }
      }

      notifications.show({
        title: "Deletion Failed",
        message,
        color: "red",
      });
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
      submitProps={{
        color: "red",
        "aria-label": `Confirm deletion of course ${course.title}`,
      }}
    >
      <Text>
        Are you sure you want to delete <strong>{course.title}</strong>? This
        action cannot be undone.
      </Text>
    </StandardModal>
  );
}
