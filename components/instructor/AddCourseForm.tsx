"use client";

import { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Modal,
  Stack,
} from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";

interface AddCourseFormProps {
  onSuccess?: () => void;
}

export default function AddCourseForm({ onSuccess }: AddCourseFormProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpened, setModalOpened] = useState<boolean>(false);

  const { isAuthenticated, user } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated || user?.role !== "instructor") {
      notifications.show({
        title: "Unauthorized",
        message: "You must be logged in as an instructor to create courses.",
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
      await api.post("/api/courses", { title, description });

      notifications.show({
        title: "Course Created",
        message: `"${title}" has been successfully added.`,
        color: "teal",
      });

      setTitle("");
      setDescription("");
      onSuccess?.();
      setModalOpened(false);
    } catch (err: unknown) {
      console.error("Failed to create course:", err);

      let message = "Could not create course. Please try again.";

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
        title: "Creation Failed",
        message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setModalOpened(true)}
      >
        Add New Course
      </Button>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Create New Course"
        centered
      >
        <Stack>
          <TextInput
            label="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            minRows={4}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Create Course
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
