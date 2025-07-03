"use client";
import { Card, SimpleGrid } from "@mantine/core";

export default function StudentOverviewCards() {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
      <Card shadow="sm" padding="lg">
        📚 3 Enrolled Courses
      </Card>
      <Card shadow="sm" padding="lg">
        🎯 7 Completed Quizzes
      </Card>
      <Card shadow="sm" padding="lg">
        🕒 12 Total Hours
      </Card>
    </SimpleGrid>
  );
}
