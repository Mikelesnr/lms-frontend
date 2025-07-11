"use client";

import {
  NavLink,
  Card,
  SimpleGrid,
  Title,
  Group,
  Box,
  Button,
  Text,
  Loader,
} from "@mantine/core";
import {
  IconBook,
  IconUsers,
  IconChartBar,
  IconHome,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CoursesTable from "@/components/instructor/CoursesTable";
import QuizAnalytics from "@/components/instructor/QuizAnalytics";
import StudentsTable from "@/components/instructor/StudentsTable";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function InstructorDashboard() {
  const [view, setView] = useState("overview");
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/api/instructor/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch instructor stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get("/api/instructor/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(response.data || []);
      } catch (err) {
        console.error("Failed to fetch instructor courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [token]);

  const navbar = (
    <>
      <NavLink
        label="🏠 Overview"
        icon={<IconHome size="1rem" />}
        active={view === "overview"}
        onClick={() => setView("overview")}
      />
      <NavLink
        label="📚 My Courses"
        icon={<IconBook size="1rem" />}
        active={view === "courses"}
        onClick={() => setView("courses")}
      />
      <NavLink
        label="📊 Quiz Analytics"
        icon={<IconChartBar size="1rem" />}
        active={view === "analytics"}
        onClick={() => setView("analytics")}
      />
      <NavLink
        label="👥 Students"
        icon={<IconUsers size="1rem" />}
        active={view === "students"}
        onClick={() => setView("students")}
      />
    </>
  );

  return (
    <RequireAuth role="instructor">
      <DashboardLayout title="Instructor Dashboard" navbar={navbar}>
        {view === "overview" && (
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="md">
            <Card shadow="sm" padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                📘 Courses
              </Text>
              {loadingStats ? (
                <Loader size="xs" mt="sm" />
              ) : (
                <Title order={3}>{stats?.courses ?? 0}</Title>
              )}
            </Card>

            <Card shadow="sm" padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                👥 Active Students
              </Text>
              {loadingStats ? (
                <Loader size="xs" mt="sm" />
              ) : (
                <Title order={3}>{stats?.active_students ?? 0}</Title>
              )}
            </Card>

            <Card shadow="sm" padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                🎓 Lessons
              </Text>
              {loadingStats ? (
                <Loader size="xs" mt="sm" />
              ) : (
                <Title order={3}>{stats?.lessons ?? 0}</Title>
              )}
            </Card>
          </SimpleGrid>
        )}

        {view === "courses" && (
          <>
            <Group justify="space-between" mb="md" mt="md" pl="md">
              <Title order={4}>📚 My Courses</Title>
              {/* You could add an "Add Course" button here */}
            </Group>
            <Box pl="md">
              {loadingCourses ? <Loader /> : <CoursesTable data={courses} />}
            </Box>
          </>
        )}

        {view === "analytics" && <QuizAnalytics />}
        {view === "students" && <StudentsTable />}
      </DashboardLayout>
    </RequireAuth>
  );
}
