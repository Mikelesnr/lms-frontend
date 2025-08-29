"use client";

import React from "react";
import { Card, Group, Text, SimpleGrid } from "@mantine/core";

interface StudentOverviewCardsProps {
  enrollments: number;
  quizzes: number;
}

const StudentOverviewCards: React.FC<StudentOverviewCardsProps> = ({
  enrollments,
  quizzes,
}) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
      <Card withBorder padding="lg" aria-label="Enrollment overview card">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            📘 Enrollments
          </Text>
          <Text size="xl">{enrollments}</Text>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          {enrollments === 0
            ? "You’re not enrolled in any active courses yet."
            : "Total courses you're currently enrolled in."}
        </Text>
      </Card>

      <Card withBorder padding="lg" aria-label="Quizzes overview card">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            ✅ Quizzes Completed
          </Text>
          <Text size="xl">{quizzes}</Text>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          {quizzes === 0
            ? "You haven’t completed any quizzes yet."
            : "Cumulative quizzes you've passed."}
        </Text>
      </Card>
    </SimpleGrid>
  );
};

export default StudentOverviewCards;
