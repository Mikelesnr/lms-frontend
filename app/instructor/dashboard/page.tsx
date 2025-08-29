"use client";

import { useEffect, useState } from "react";
import {
  Card,
  SimpleGrid,
  Title,
  Text,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";

// Define interface for instructor stats
interface InstructorStats {
  courses: number;
  active_students: number;
  lessons: number;
}

export default function InstructorDashboardOverviewPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if authenticated and user is an instructor
    if (!authLoading && isAuthenticated && user?.role === "instructor") {
      const fetchStats = async () => {
        setLoadingStats(true);
        setError(null);
        try {
          const response = await api.get<InstructorStats>(
            "/api/instructor/overview"
          );
          setStats(response.data);
          notifications.show({
            title: "Dashboard Stats Loaded",
            message: "Instructor overview statistics have been updated.",
            color: "teal",
            autoClose: 3000,
          });
        } catch (err: unknown) {
          console.error("Failed to fetch instructor stats:", err);

          let message = "Failed to load instructor dashboard stats.";
          if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof (err as { response?: { data?: { message?: string } } })
              .response?.data?.message === "string"
          ) {
            message = (err as { response?: { data?: { message?: string } } })
              .response!.data!.message!;
          }

          setError(message);
          notifications.show({
            title: "Stats Load Failed",
            message:
              "Unable to fetch dashboard statistics. Please try again later.",
            color: "red",
          });
        } finally {
          setLoadingStats(false);
        }
      };

      fetchStats();
    }
  }, [authLoading, isAuthenticated, user]);

  if (authLoading || loadingStats) {
    return (
      <Center style={{ height: "50vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

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

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="md">
      <Card shadow="sm" padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          📘 Courses
        </Text>
        <Title order={3}>{stats?.courses ?? 0}</Title>
      </Card>

      <Card shadow="sm" padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          👥 Active Students
        </Text>
        <Title order={3}>{stats?.active_students ?? 0}</Title>
      </Card>

      <Card shadow="sm" padding="lg" radius="md">
        <Text size="sm" c="dimmed">
          🎓 Lessons
        </Text>
        <Title order={3}>{stats?.lessons ?? 0}</Title>
      </Card>
    </SimpleGrid>
  );
}
