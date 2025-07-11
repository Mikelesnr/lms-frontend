"use client";

import { Modal, Title, Text, Image, Stack } from "@mantine/core";

export default function CourseDetailsModal({ opened, onClose, course }) {
  if (!course) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={course.title}
      size="lg"
      centered
    >
      <Stack spacing="lg" style={{ minHeight: 400, position: "relative" }}>
        {/* Static Image Placeholder */}
        <Image
          src={course.image_url || "/placeholder.jpg"}
          alt={course.title}
          height={200}
          radius="md"
        />

        {/* Full Description */}
        <Text size="sm">{course.description}</Text>
        <Text size="xs" c="dimmed">
          Category: {course.category}
        </Text>
      </Stack>
    </Modal>
  );
}
