"use client";

import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lesson } from "@/types";

interface DeleteLessonConfirmProps {
  lesson: Lesson | null;
  onClose: () => void;
  onDeleted: () => void;
}

export default function DeleteLessonConfirm({
  lesson,
  onClose,
  onDeleted,
}: DeleteLessonConfirmProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  if (!lesson) return null;

  const handleDelete = async () => {
    if (!isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to delete lessons.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      await api.delete(`/api/lessons/${lesson.id}`);

      notifications.show({
        title: "Lesson deleted",
        message: `“${lesson.title}” has been removed.`,
        color: "red",
        autoClose: 3000,
      });

      onDeleted();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to delete lesson:", err);

      let message = "Could not delete this lesson. Please try again.";

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
        title: "Deletion failed",
        message,
        color: "red",
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
      submitProps={{
        color: "red",
        "aria-label": `Confirm delete lesson ${lesson.title}`,
      }}
    >
      <Text>
        Are you sure you want to delete <strong>{lesson.title}</strong>? This
        action cannot be undone.
      </Text>
    </StandardModal>
  );
}
