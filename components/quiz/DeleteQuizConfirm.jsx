"use client";

import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function DeleteQuizConfirm({ quiz, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  if (!quiz) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/quizzes/${quiz.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      notifications.show({
        title: "Quiz Deleted",
        message: `“${quiz.title || "Untitled Quiz"}” has been removed.`,
        color: "red",
        autoClose: 3000,
      });

      onDeleted?.();
      onClose?.();
    } catch (err) {
      console.error("Quiz delete failed:", err);
      notifications.show({
        title: "Deletion Failed",
        message: "Could not delete this quiz. Please try again.",
        color: "orange",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!quiz}
      onClose={onClose}
      onSubmit={handleDelete}
      title="Delete Quiz"
      loading={loading}
      submitLabel="Delete"
      submitProps={{ color: "red", "aria-label": "Confirm quiz deletion" }}
    >
      <Text>
        Are you sure you want to delete{" "}
        <strong>{quiz.title || "this quiz"}</strong>?<br />
        This will permanently remove all questions and answers.
      </Text>
    </StandardModal>
  );
}
