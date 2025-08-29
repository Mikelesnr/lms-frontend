"use client";

import { useEffect, useState } from "react";
import { Card, SimpleGrid, Loader, Center, Text, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";

// Define interface for admin stats
interface AdminStats {
  instructors: number;
  students: number;
  courses: number;
}

export default function AdminDashboardOverviewPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const extractErrorMessage = (err: unknown): string => {
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { data?: { message?: string } } }).response
        ?.data?.message === "string"
    ) {
      return (err as { response?: { data?: { message?: string } } }).response!
        .data!.message!;
    } else if (err instanceof Error) {
      return err.message;
    }
    return "Failed to load admin dashboard stats.";
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.role === "admin") {
      const fetchStats = async () => {
        setLoadingStats(true);
        setError(null);
        try {
          const res = await api.get<AdminStats>("/api/admin/stats");
          setStats(res.data);
          notifications.show({
            title: "Dashboard Stats Loaded",
            message: "Admin overview statistics have been updated.",
            color: "teal",
            autoClose: 3000,
          });
        } catch (err: unknown) {
          console.error("Failed to fetch dashboard stats:", err);
          setError(extractErrorMessage(err));
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
      <Card shadow="sm" padding="lg">
        <Text size="lg" fw={600} mb="xs">
          👨‍🏫 Instructors
        </Text>
        <Text size="xl">{stats?.instructors ?? "…"}</Text>
      </Card>
      <Card shadow="sm" padding="lg">
        <Text size="lg" fw={600} mb="xs">
          👩‍🎓 Students
        </Text>
        <Text size="xl">{stats?.students ?? "…"}</Text>
      </Card>
      <Card shadow="sm" padding="lg">
        <Text size="lg" fw={600} mb="xs">
          📘 Courses
        </Text>
        <Text size="xl">{stats?.courses ?? "…"}</Text>
      </Card>
    </SimpleGrid>
  );
}
