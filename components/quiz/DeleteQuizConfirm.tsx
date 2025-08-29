"use client";

import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import api from "@/lib/api";

interface QuizToDelete {
  id: number;
  title?: string;
}

interface DeleteQuizConfirmProps {
  quiz: QuizToDelete | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function DeleteQuizConfirm({
  quiz,
  onClose,
  onDeleted,
}: DeleteQuizConfirmProps) {
  const [loading, setLoading] = useState<boolean>(false);

  if (!quiz) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/api/quizzes/${quiz.id}`);

      notifications.show({
        title: "Quiz Deleted",
        message: `“${quiz.title || "Untitled Quiz"}” has been removed.`,
        color: "red",
        autoClose: 3000,
      });

      onDeleted?.();
      onClose?.();
    } catch (err: unknown) {
      console.error("Quiz delete failed:", err);

      let message = "Could not delete this quiz. Please try again.";

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
