"use client";

import { useEffect, useState } from "react";
import { TextInput, Textarea, Loader, Stack } from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useAuth } from "@/context/AuthContext";
import api, { getCsrfCookie } from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { Lesson } from "@/types";

interface EditLessonModalProps {
  lesson: Lesson | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditLessonModal({
  lesson,
  onClose,
  onSaved,
}: EditLessonModalProps) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingLessonData, setFetchingLessonData] = useState<boolean>(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    setFetchingLessonData(true);
    if (lesson) {
      setTitle(lesson.title || "");
      setContent(lesson.content || "");
      setVideoUrl(lesson.video_url || "");
    } else {
      setTitle("");
      setContent("");
      setVideoUrl("");
    }
    setFetchingLessonData(false);
  }, [lesson]);

  const handleUpdate = async () => {
    if (!lesson || !isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to edit lessons.",
        color: "red",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      notifications.show({
        title: "Missing Fields",
        message: "Lesson title and content are required.",
        color: "orange",
      });
      return;
    }

    setLoading(true);

    try {
      await getCsrfCookie();
      await api.put(`/api/lessons/${lesson.id}`, {
        title,
        content,
        video_url: videoUrl,
      });

      notifications.show({
        title: "Lesson Updated",
        message: `"${title}" has been successfully updated.`,
        color: "teal",
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to update lesson:", err);

      let message = "Could not update lesson. Please try again.";

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
        color: "red",
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
      title="Edit Lesson"
      loading={loading}
      submitProps={{ "aria-label": "Submit updated lesson details" }}
    >
      {fetchingLessonData ? (
        <Loader mt="sm" />
      ) : (
        <Stack>
          <TextInput
            label="Lesson Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Lesson Title input field"
          />
          <Textarea
            label="Content"
            mt="sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            minRows={4}
            required
            aria-label="Lesson Content textarea"
          />
          <TextInput
            label="Video URL (Optional)"
            mt="sm"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            aria-label="Lesson Video URL input field"
          />
        </Stack>
      )}
    </StandardModal>
  );
}
