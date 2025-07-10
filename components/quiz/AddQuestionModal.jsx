"use client";

import { useState } from "react";
import { Modal, Textarea, Button, Group } from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function AddQuestionModal({
  quizId,
  opened,
  onClose,
  onSuccess,
}) {
  const [questionText, setQuestionText] = useState("");
  const { sanctumPost } = useSanctumRequest();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!questionText.trim()) return;
    setLoading(true);
    try {
      const res = await sanctumPost("/api/quiz-questions", {
        quiz_id: quizId,
        question_text: questionText,
      });
      setQuestionText("");
      onSuccess?.(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to add question:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Quiz Question" centered>
      <Textarea
        label="Question Text"
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
      />
      <Group mt="md" justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={loading}>
          Add Question
        </Button>
      </Group>
    </Modal>
  );
}
