"use client";

import { useEffect, useState } from "react";
import { TextInput, Loader, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import StandardModal from "@/components/layouts/StandardModal";
import api from "@/lib/api";

interface LessonForQuizEdit {
  id: number;
}

interface EditQuizModalProps {
  lesson: LessonForQuizEdit | null;
  onClose: () => void;
  onSaved?: () => void;
}

interface QuizData {
  title: string;
}

export default function EditQuizModal({
  lesson,
  onClose,
  onSaved,
}: EditQuizModalProps) {
  const [title, setTitle] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lesson) {
        setFetching(false);
        return;
      }

      try {
        const res = await api.get<QuizData>(`/api/lessons/${lesson.id}/quiz`);
        setTitle(res.data?.title ?? "");
      } catch (err: unknown) {
        console.error("Failed to load quiz title:", err);

        let message = "Unable to load quiz data for this lesson.";

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

        setTitle("");
        notifications.show({
          title: "Fetch Error",
          message,
          color: "red",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchQuiz();
  }, [lesson]);

  const handleUpdate = async () => {
    if (!lesson || !title.trim()) return;
    setLoading(true);

    try {
      await api.put(`/api/lessons/${lesson.id}/quiz`, { title });

      notifications.show({
        title: "Quiz Updated",
        message: "Your quiz title has been successfully saved.",
        color: "teal",
      });

      onSaved?.();
      onClose?.();
    } catch (err: unknown) {
      console.error("Failed to update quiz:", err);

      let message = "Could not update the quiz title. Please try again.";

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
        title: "Update Failed",
        message,
        color: "orange",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StandardModal
      opened={!!lesson}
      onClose={onClose}
      onSubmit={handleUpdate}
      title="Edit Quiz Title"
      loading={loading}
      submitProps={{ "aria-label": "Submit updated quiz title" }}
    >
      {fetching ? (
        <Loader mt="sm" />
      ) : title ? (
        <TextInput
          label="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          aria-label="Quiz title input field"
        />
      ) : (
        <Text color="red" size="sm">
          Quiz not found for this lesson.
        </Text>
      )}
    </StandardModal>
  );
}
