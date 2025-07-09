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
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import CoursesTable from "@/components/instructor/CoursesTable";
import QuizAnalytics from "@/components/instructor/QuizAnalytics";
import StudentsTable from "@/components/instructor/StudentsTable";
import useInstructorStats from "@/lib/hooks/useInstructorStats";
import RequireAuth from "@/components/auth/RequireAuth";

export default function InstructorDashboard() {
  const [view, setView] = useState("overview");
  const { stats, loading: statsLoading } = useInstructorStats();

  const data = [
    { id: 1, title: "Intro to JavaScript", students: 34 },
    { id: 2, title: "Laravel Bootcamp", students: 52 },
    { id: 3, title: "React for Beginners", students: 20 },
  ];

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
              {statsLoading ? (
                <Loader size="xs" mt="sm" />
              ) : (
                <Title order={3}>{stats?.courses ?? 0}</Title>
              )}
            </Card>

            <Card shadow="sm" padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                👥 Active Students
              </Text>
              {statsLoading ? (
                <Loader size="xs" mt="sm" />
              ) : (
                <Title order={3}>{stats?.active_students ?? 0}</Title>
              )}
            </Card>

            <Card shadow="sm" padding="lg" radius="md">
              <Text size="sm" c="dimmed">
                🎓 Lessons
              </Text>
              {statsLoading ? (
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
              {/* <Button size="sm">Add Course</Button> */}
            </Group>
            <Box pl="md">
              <CoursesTable data={data} />
            </Box>
          </>
        )}

        {view === "analytics" && <QuizAnalytics />}
        {view === "students" && <StudentsTable />}
      </DashboardLayout>
    </RequireAuth>
  );
}
