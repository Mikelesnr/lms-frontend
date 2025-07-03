"use client";

import { NavLink } from "@mantine/core";
import { IconHome, IconBook, IconChartBar } from "@tabler/icons-react";
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import StudentOverviewCards from "@/components/student/OverviewCards";
import EnrolledCoursesTable from "@/components/student/EnrolledCoursesTable";
import StudentQuizAnalytics from "@/components/student/QuizAnalytics";

export default function StudentDashboard() {
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
        label="📘 Enrollments"
        icon={<IconBook size="1rem" />}
        active={view === "courses"}
        onClick={() => setView("courses")}
      />
      <NavLink
        label="📊 Quiz Results"
        icon={<IconChartBar size="1rem" />}
        active={view === "analytics"}
        onClick={() => setView("analytics")}
      />
    </>
  );

  return (
    <DashboardLayout title="Student Dashboard" navbar={navbar}>
      {view === "overview" && <StudentOverviewCards />}
      {view === "courses" && <EnrolledCoursesTable />}
      {view === "analytics" && <StudentQuizAnalytics />}
    </DashboardLayout>
  );
}
