"use client";

import { useEffect, useState } from "react";
import { Card, Group, Text, SimpleGrid, Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function StudentOverviewCards() {
  const [enrollments, setEnrollments] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enrollRes, quizRes] = await Promise.all([
          sanctumGet("/api/me/active-enrollments-count"),
          sanctumGet("/api/me/completed-quizzes-count"),
        ]);

        setEnrollments(enrollRes.data?.active_enrollments ?? 0);
        setQuizzes(quizRes.data?.completed_quizzes ?? 0);
      } catch (err) {
        console.error("❌ Failed to load overview stats:", err);
        setError("Something went wrong while loading your progress.");
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        mt="md"
      >
        {error}
      </Alert>
    );
  }

  if (enrollments === null || quizzes === null) {
    return <Loader mt="xl" />;
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" mb="xl">
      <Card withBorder padding="lg">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            📘 Enrollments
          </Text>
          <Text size="xl">{enrollments}</Text>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          Total courses you're currently enrolled in
        </Text>
      </Card>

      <Card withBorder padding="lg">
        <Group justify="space-between">
          <Text size="lg" fw={600}>
            ✅ Quizzes Completed
          </Text>
          <Text size="xl">{quizzes}</Text>
        </Group>
        <Text size="xs" c="dimmed" mt="sm">
          Cumulative quizzes you've passed
        </Text>
      </Card>
    </SimpleGrid>
  );
}
