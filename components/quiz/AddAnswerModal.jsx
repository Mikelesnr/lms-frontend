"use client";

import { useState } from "react";
import { Modal, TextInput, Checkbox, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function AddAnswerModal({
  questionId,
  opened,
  onClose,
  onSuccess,
}) {
  const [text, setText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useAuthStore();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        "/api/quiz-answers",
        {
          question_id: questionId,
          answer_text: text,
          is_correct: isCorrect,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notifications.show({
        title: "Answer added",
        message: `Your answer has been saved${isCorrect ? " as correct" : ""}.`,
        color: "teal",
      });

      setText("");
      setIsCorrect(false);
      onSuccess?.(res.data);
      onClose?.();
    } catch (err) {
      console.error("Error creating answer:", err);
      notifications.show({
        title: "Submission failed",
        message: "Could not create this answer. Please try again.",
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
      title="Add Answer"
      centered
      closeButtonProps={{ "aria-label": "Close Add Answer modal" }}
    >
      <TextInput
        label="Answer Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <Checkbox
        label="Is this answer correct?"
        checked={isCorrect}
        onChange={(e) => setIsCorrect(e.currentTarget.checked)}
        mt="sm"
      />
      <Group mt="md" justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={handleSubmit}
          aria-label="Submit quiz answer"
        >
          Add Answer
        </Button>
      </Group>
    </Modal>
  );
}
