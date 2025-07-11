"use client";

import { useState } from "react";
import { Modal, Textarea, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function AddQuestionModal({
  quizId,
  opened,
  onClose,
  onSuccess,
}) {
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async () => {
    if (!questionText.trim()) {
      notifications.show({
        title: "Missing Question",
        message: "Please enter a question before submitting.",
        color: "orange",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        "/api/quiz-questions",
        {
          quiz_id: quizId,
          question_text: questionText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notifications.show({
        title: "Question added",
        message: "Your quiz question has been saved.",
        color: "teal",
      });

      setQuestionText("");
      onSuccess?.(res.data);
      onClose?.();
    } catch (err) {
      console.error("Failed to add question:", err);
      notifications.show({
        title: "Submission failed",
        message: "Could not create this question. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add Quiz Question"
      centered
      closeButtonProps={{ "aria-label": "Close Add Question modal" }}
    >
      <Textarea
        label="Question Text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        required
        minRows={3}
      />
      <Group mt="md" justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          loading={loading}
          aria-label="Submit quiz question"
        >
          Add Question
        </Button>
      </Group>
    </Modal>
  );
}
