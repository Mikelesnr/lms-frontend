"use client";

import { Card, Title, Text, Loader, SimpleGrid } from "@mantine/core";
import useQuizStats from "@/lib/hooks/useQuizStats";

export default function QuizAnalytics() {
  const { stats, loading } = useQuizStats();

  return (
    <Card shadow="sm" padding="lg" radius="md" mt="md">
      <Title order={5} mb="sm">
        📊 Quiz Analytics
      </Title>

      {loading ? (
        <Loader />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <div>
            <Text size="sm" c="dimmed">
              🧩 Total Quizzes
            </Text>
            <Title order={3}>{stats?.total_quizzes ?? 0}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              ❓ Total Questions
            </Text>
            <Title order={3}>{stats?.total_questions ?? 0}</Title>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              📏 Avg. per Quiz
            </Text>
            <Title order={3}>{stats?.average_questions_per_quiz ?? 0}</Title>
          </div>
        </SimpleGrid>
      )}
    </Card>
  );
}
