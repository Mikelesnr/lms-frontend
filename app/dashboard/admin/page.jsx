"use client";

import { NavLink, Card, SimpleGrid, Title, Box, Select } from "@mantine/core";
import {
  IconHome,
  IconBook,
  IconUsers,
  IconUserCog,
} from "@tabler/icons-react";
import InstructorManager from "@/components/admin/ InstructorManager";
import StudentManager from "@/components/admin/StudentManager";
import CourseManager from "@/components/admin/ CourseManager";
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function AdminDashboard() {
  const [view, setView] = useState("overview");
  const [stats, setStats] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await sanctumGet("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const navbar = (
    <>
      <NavLink
        label="🏠 Overview"
        icon={<IconHome size="1rem" />}
        active={view === "overview"}
        onClick={() => setView("overview")}
      />
      <NavLink
        label="👨‍🏫 Instructors"
        icon={<IconUserCog size="1rem" />}
        active={view === "instructors"}
        onClick={() => setView("instructors")}
      />
      <NavLink
        label="👩‍🎓 Students"
        icon={<IconUsers size="1rem" />}
        active={view === "students"}
        onClick={() => setView("students")}
      />
      <NavLink
        label="📘 Courses"
        icon={<IconBook size="1rem" />}
        active={view === "courses"}
        onClick={() => setView("courses")}
      />
    </>
  );

  return (
    <RequireAuth role="admin">
      <DashboardLayout title="Admin Dashboard" navbar={navbar}>
        {view === "overview" && (
          <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="md">
            <Card shadow="sm" padding="lg">
              🧑‍🏫 {stats ? stats.instructors : "…"} Instructors
            </Card>
            <Card shadow="sm" padding="lg">
              👩‍🎓 {stats ? stats.students : "…"} Students
            </Card>
            <Card shadow="sm" padding="lg">
              📘 {stats ? stats.courses : "…"} Courses
            </Card>
          </SimpleGrid>
        )}

        {view === "instructors" && <InstructorManager />}
        {view === "students" && <StudentManager />}
        {view === "courses" && <CourseManager />}
      </DashboardLayout>
    </RequireAuth>
  );
}
