"use client";

import { useState } from "react";
import { Modal, TextInput, Checkbox, Button, Group } from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function AddAnswerModal({
  questionId,
  opened,
  onClose,
  onSuccess,
}) {
  const [text, setText] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const { sanctumPost } = useSanctumRequest();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await sanctumPost("/api/quiz-answers", {
        question_id: questionId,
        answer_text: text,
        is_correct: isCorrect,
      });
      setText("");
      setIsCorrect(false);
      onSuccess?.(res.data);
      onClose();
    } catch (err) {
      console.error("Error creating answer:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add Answer" centered>
      <TextInput
        label="Answer Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
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
        <Button loading={loading} onClick={handleSubmit}>
          Add Answer
        </Button>
      </Group>
    </Modal>
  );
}
