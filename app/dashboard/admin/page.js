"use client";

import { NavLink, Card, SimpleGrid, Title, Box } from "@mantine/core";
import {
  IconHome,
  IconBook,
  IconUsers,
  IconUserCog,
} from "@tabler/icons-react";
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function AdminDashboard() {
  const [view, setView] = useState("overview");

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
    <DashboardLayout title="Admin Dashboard" navbar={navbar}>
      {view === "overview" && (
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mt="md">
          <Card shadow="sm" padding="lg">
            🧑‍🏫 12 Instructors
          </Card>
          <Card shadow="sm" padding="lg">
            👩‍🎓 215 Students
          </Card>
          <Card shadow="sm" padding="lg">
            📘 48 Courses
          </Card>
        </SimpleGrid>
      )}

      {view === "instructors" && (
        <Card mt="md" padding="lg">
          Instructor management goes here
        </Card>
      )}
      {view === "students" && (
        <Card mt="md" padding="lg">
          Student list and tools go here
        </Card>
      )}
      {view === "courses" && (
        <Card mt="md" padding="lg">
          Platform-wide course access
        </Card>
      )}
    </DashboardLayout>
  );
}
