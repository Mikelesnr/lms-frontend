"use client";

import { Card, Title, Text, Loader, SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function QuizAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/instructor/quiz-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data ?? {});
      } catch (err) {
        console.error("Failed to load quiz stats:", err);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

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
