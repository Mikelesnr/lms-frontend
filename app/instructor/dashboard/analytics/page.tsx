"use client";

import { Card, Title, Text, Loader, SimpleGrid, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";

// Define interface for quiz analytics stats
interface QuizStats {
  total_quizzes: number;
  total_questions: number;
  average_questions_per_quiz: number;
}

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const response = (err as { response?: { data?: unknown } }).response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      typeof (response as { data?: unknown }).data === "object"
    ) {
      const data = (response as { data?: Record<string, unknown> }).data;
      if (data?.message && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "Failed to load quiz analytics.";
}

export default function InstructorQuizAnalyticsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "instructor") {
      const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await api.get<QuizStats>("/api/instructor/quiz-stats");
          setStats(res.data ?? null);
          notifications.show({
            title: "Quiz Stats Loaded",
            message: "Quiz analytics have been updated.",
            color: "teal",
            autoClose: 3000,
          });
        } catch (err: unknown) {
          console.error("Failed to load quiz stats:", err);
          const message = extractErrorMessage(err);
          setError(message);
          notifications.show({
            title: "Load Failed",
            message,
            color: "red",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }
  }, [authLoading, isAuthenticated, user]);

  if (authLoading || loading) {
    return <Loader mt="xl" />;
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading quiz analytics"
        color="red"
        mt="md"
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" mt="md">
      <Title order={5} mb="sm">
        📊 Quiz Analytics
      </Title>

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
    </Card>
  );
}
