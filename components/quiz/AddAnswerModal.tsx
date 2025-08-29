"use client";

import { useState } from "react";
import { Modal, TextInput, Checkbox, Button, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

interface NewAnswer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
}

interface AddAnswerModalProps {
  questionId: number | null;
  opened: boolean;
  onClose: () => void;
  onSuccess?: (answer: NewAnswer) => void;
}

export default function AddAnswerModal({
  questionId,
  opened,
  onClose,
  onSuccess,
}: AddAnswerModalProps) {
  const [text, setText] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to add answers.",
        color: "red",
      });
      return;
    }

    if (questionId === null) {
      notifications.show({
        title: "Error",
        message: "Question ID is missing. Cannot add answer.",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<NewAnswer>("/api/quiz-answers", {
        question_id: questionId,
        answer_text: text,
        is_correct: isCorrect,
      });

      notifications.show({
        title: "Answer added",
        message: `Your answer has been saved${isCorrect ? " as correct" : ""}.`,
        color: "teal",
      });

      setText("");
      setIsCorrect(false);
      onSuccess?.(res.data);
      onClose();
    } catch (err: unknown) {
      console.error("Error creating answer:", err);

      let message = "Could not create this answer. Please try again.";

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
