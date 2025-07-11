"use client";

import { useEffect, useState } from "react";
import { TextInput, Loader, Text, notifications } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function EditQuizModal({ lesson, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lesson) return;

      try {
        const res = await api.get(`/api/lessons/${lesson.id}/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTitle(res.data?.title ?? "");
      } catch (err) {
        console.error("Failed to load quiz title:", err);
        setTitle("");
        notifications.show({
          title: "Fetch Error",
          message: "Unable to load quiz data for this lesson.",
          color: "red",
        });
      } finally {
        setFetching(false);
      }
    };

    fetchQuiz();
  }, [lesson, token]);

  const handleUpdate = async () => {
    if (!lesson || !title.trim()) return;
    setLoading(true);

    try {
      await api.put(
        `/api/lessons/${lesson.id}/quiz`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      notifications.show({
        title: "Quiz Updated",
        message: "Your quiz title has been successfully saved.",
        color: "teal",
      });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update quiz:", err);
      notifications.show({
        title: "Update Failed",
        message: "Could not update the quiz title. Please try again.",
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
