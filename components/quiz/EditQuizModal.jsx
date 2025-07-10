"use client";

import { useEffect, useState } from "react";
import { TextInput, Loader, Text } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function EditQuizModal({ lesson, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { sanctumPut, sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!lesson) return;

      try {
        const res = await sanctumGet(`/api/lessons/${lesson.id}/quiz`);
        setTitle(res.data?.title ?? "");
      } catch (err) {
        console.error("Failed to load quiz title:", err);
        setTitle("");
      } finally {
        setFetching(false);
      }
    };

    fetchQuiz();
  }, [lesson, sanctumGet]);

  const handleUpdate = async () => {
    if (!lesson) return;
    setLoading(true);

    try {
      await sanctumPut(`/api/lessons/${lesson.id}/quiz`, { title });
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("Failed to update quiz:", err);
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
    >
      {fetching ? (
        <Loader mt="sm" />
      ) : title ? (
        <TextInput
          label="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      ) : (
        <Text color="red" size="sm">
          Quiz not found for this lesson.
        </Text>
      )}
    </StandardModal>
  );
}
