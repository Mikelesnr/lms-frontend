"use client";

import { useEffect, useState } from "react";
import { Card, Group, Text, SimpleGrid, Loader, Alert } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function StudentOverviewCards() {
  const [enrollments, setEnrollments] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [enrollRes, quizRes] = await Promise.all([
          api.get("/api/me/active-enrollments-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/api/me/completed-quizzes-count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const enrollmentCount = enrollRes.data?.active_enrollments ?? 0;
        const quizCount = quizRes.data?.completed_quizzes ?? 0;

        setEnrollments(enrollmentCount);
        setQuizzes(quizCount);

        notifications.show({
          title: "Progress Loaded",
          message: `You have ${enrollmentCount} enrollments and ${quizCount} completed quizzes.`,
          color: "teal",
        });
      } catch (err) {
        console.error("❌ Failed to load overview stats:", err);
        setError("Something went wrong while loading your progress.");
        notifications.show({
          title: "Load Failed",
          message: "We couldn’t fetch your overview stats. Try again later.",
          color: "red",
        });
      }
    };

    fetchStats();
  }, [token]);

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
}
