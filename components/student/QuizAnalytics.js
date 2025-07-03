"use client";
import { Card, Title, Text } from "@mantine/core";

export default function StudentQuizAnalytics() {
  return (
    <Card shadow="sm" padding="lg">
      <Title order={5}>📊 Quiz Analytics</Title>
      <Text c="dimmed" size="sm" mt="xs">
        Charts and quiz feedback will appear here.
      </Text>
    </Card>
  );
}
