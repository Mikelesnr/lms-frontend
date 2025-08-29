"use client";

import { useState } from "react";
import { Modal, Textarea, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "@/lib/api";

interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

interface NewQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  answers: Answer[];
}

interface AddQuestionModalProps {
  quizId: number;
  opened: boolean;
  onClose: () => void;
  onSuccess?: (question: NewQuestion) => void;
}

export default function AddQuestionModal({
  quizId,
  opened,
  onClose,
  onSuccess,
}: AddQuestionModalProps) {
  const [questionText, setQuestionText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
      const res = await api.post<Omit<NewQuestion, "answers">>(
        "/api/quiz-questions",
        {
          quiz_id: quizId,
          question_text: questionText,
        }
      );

      notifications.show({
        title: "Question added",
        message: "Your quiz question has been saved.",
        color: "teal",
      });

      setQuestionText("");
      onSuccess?.({ ...res.data, answers: [] });
      onClose();
    } catch (err: unknown) {
      console.error("Failed to add question:", err);

      let message = "Could not create this question. Please try again.";

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
        title: "Submission failed",
        message,
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
