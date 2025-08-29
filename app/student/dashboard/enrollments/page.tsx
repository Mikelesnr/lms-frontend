"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Loader,
  Alert,
  Title,
  Box,
  Center,
  Text,
  Button,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import EnrolledCoursesGrid from "@/components/student/EnrolledCoursesGrid";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Course } from "@/types";

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
  return "Could not load your enrolled courses.";
}

const StudentEnrollmentsPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const fetchCourses = useCallback(async () => {
    if (!authLoading && isAuthenticated && user) {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await api.get<Course[]>("/api/enrollments/me");
        setCourses(response.data || []);
        notifications.show({
          title: "Enrollments Loaded",
          message: `You are enrolled in ${response.data.length} course(s).`,
          color: "teal",
          autoClose: 3000,
        });
      } catch (err: unknown) {
        console.error("❌ Error fetching enrollments:", err);
        setCourses([]);
        setLoadError(extractErrorMessage(err));
        notifications.show({
          title: "Load Failed",
          message: extractErrorMessage(err),
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (loading || authLoading) return <Loader mt="xl" />;

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Fetch error"
        color="red"
        mt="md"
      >
        {loadError}
      </Alert>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={2}>Your Enrolled Courses</Title>
        <Button
          leftSection={<IconRefresh size={18} />}
          variant="default"
          onClick={fetchCourses}
          loading={loading}
          aria-label="Refresh enrolled courses"
        >
          Refresh
        </Button>
      </Group>

      {courses.length === 0 ? (
        <Center mt="xl">
          <Text c="dimmed">You haven’t enrolled in any courses yet.</Text>
        </Center>
      ) : (
        <EnrolledCoursesGrid courses={courses} />
      )}
    </Box>
  );
};

export default StudentEnrollmentsPage;
