"use client";

import React from "react";
import {
  Modal,
  Group,
  Title,
  Text,
  Badge,
  Divider,
  Image,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { CourseDetailsModalProps } from "@/types"; // Import Course and CourseDetailsModalProps

const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  opened,
  onClose,
  course,
}) => {
  if (!course) {
    return null; // Prevents rendering if no course data is provided
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      // Fixed: Pass Text component directly to Modal title, let Modal handle the H2 tag
      title={
        <Text component="h3" size="xl" fw={700}>
          {course.title}
        </Text>
      } // Using Text with h3 semantic tag, styled for visual hierarchy
      size="lg"
      scrollAreaComponent={ScrollArea.Autosize} // Automatically adjust scroll area based on content
    >
      <Divider my="md" />

      <Stack gap="md">
        {" "}
        {/* Use gap instead of spacing for Mantine v7+ */}
        {/* The Image component will always render; ensure /placeholder.jpg exists in your public folder */}
        <Image
          src={course.image_url || "/placeholder.jpg"} // Fallback to placeholder if image_url is null/undefined/empty
          height={200}
          alt={`Image for ${course.title}`}
          fit="cover"
          radius="md"
        />
        <Group justify="space-between">
          <Badge size="lg" color="blue" variant="filled">
            Category: {course.category}
          </Badge>
          {course.is_published ? (
            <Badge size="lg" color="green" variant="light">
              Published
            </Badge>
          ) : (
            <Badge size="lg" color="gray" variant="light">
              Unpublished
            </Badge>
          )}
        </Group>
        <Title order={5}>Description</Title>
        <Text>{course.description}</Text>
        <Divider my="sm" />
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Created At: {new Date(course.created_at).toLocaleDateString()}
          </Text>
          {course.published_at && (
            <Text size="sm" c="dimmed">
              Published At: {new Date(course.published_at).toLocaleDateString()}
            </Text>
          )}
        </Group>
      </Stack>
    </Modal>
  );
};

export default CourseDetailsModal;
