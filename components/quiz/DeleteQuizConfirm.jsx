"use client";
import { Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { useState } from "react";

export default function DeleteQuizConfirm({ quiz, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  if (!quiz) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const xsrfToken = Cookies.get("XSRF-TOKEN");
      await api.delete(`/api/quizzes/${quiz.id}`, {
        headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) },
      });
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
