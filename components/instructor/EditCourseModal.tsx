"use client";

import { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Loader,
  Stack,
  Switch,
  Group,
  Text,
} from "@mantine/core";
import StandardModal from "@/components/layouts/StandardModal";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { Course } from "@/types";

interface EditCourseModalProps {
  course: Course | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditCourseModal({
  course,
  onClose,
  onSaved,
}: EditCourseModalProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingCourseData, setFetchingCourseData] = useState<boolean>(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const loadCourseData = async () => {
      if (!course) {
        setTitle("");
        setDescription("");
        setIsPublished(false);
        setFetchingCourseData(false);
        return;
      }

      setTitle(course.title || "");
      setDescription(course.description || "");
      setIsPublished(course.is_published ?? false);
      setFetchingCourseData(false);
    };

    loadCourseData();
  }, [course]);

  const handleUpdate = async () => {
    if (!course || !isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to edit courses.",
        color: "red",
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      notifications.show({
        title: "Missing Fields",
        message: "Course title and description are required.",
        color: "orange",
      });
      return;
    }

    setLoading(true);

    try {
      await api.put(`/api/courses/${course.id}`, {
        title,
        description,
        is_published: isPublished,
      });

      notifications.show({
        title: "Course Updated",
        message: `"${title}" has been successfully updated.`,
        color: "teal",
      });

      onSaved();
      onClose();
    } catch (err: unknown) {
      console.error("Failed to update course:", err);

      let message = "Could not update course. Please try again.";

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
      opened={!!course}
      onClose={onClose}
      onSubmit={handleUpdate}
      title="Edit Course"
      loading={loading}
      submitProps={{ "aria-label": "Submit updated course details" }}
    >
      {fetchingCourseData ? (
        <Loader mt="sm" />
      ) : (
        <Stack>
          <TextInput
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Course Title input field"
          />
          <Textarea
            label="Description"
            mt="sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={4}
            required
            aria-label="Course Description textarea"
          />
          <Group mt="md" justify="space-between" align="center">
            <Text fw={500} size="sm">
              Publish Course
            </Text>
            <Switch
              checked={isPublished}
              onChange={(event) => setIsPublished(event.currentTarget.checked)}
              label={isPublished ? "Published" : "Draft"}
              color="teal"
              size="md"
              aria-label="Toggle course publication status"
            />
          </Group>
        </Stack>
      )}
    </StandardModal>
  );
}
