"use client";

import { Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useState } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function DeleteQuizConfirm({ quiz, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const { sanctumDelete } = useSanctumRequest();

  if (!quiz) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sanctumDelete(`/api/quizzes/${quiz.id}`);
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Quiz delete failed", err);
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
      submitProps={{ color: "red" }}
    >
      <Text>
        Are you sure you want to delete{" "}
        <strong>{quiz.title || "this quiz"}</strong>?<br />
        This will permanently remove all questions and answers.
      </Text>
    </StandardModal>
  );
}
