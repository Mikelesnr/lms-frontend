"use client";

import { Card, Title, Text } from "@mantine/core";

export default function StudentsTable() {
  return (
    <Card shadow="sm" padding="lg" radius="md" mt="md">
      <Title order={5}>👥 Student Management</Title>
      <Text c="dimmed" size="sm" mt="xs">
        Placeholder for student list, enrollment status, and engagement metrics.
      </Text>
    </Card>
  );
}
