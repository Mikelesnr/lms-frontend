"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavLink, Loader, Center } from "@mantine/core";
import { IconHome, IconBook, IconChartBar } from "@tabler/icons-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext"; // Import useAuth from your AuthContext

interface StudentDashboardLayoutProps {
  children: React.ReactNode;
}

const StudentDashboardLayout: React.FC<StudentDashboardLayoutProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const { loading: authLoading, isAuthenticated, user } = useAuth();

  // If auth is still loading, show a loader
  if (authLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  // If not authenticated or not a student, RequireAuth will handle redirection
  // We explicitly return null here as RequireAuth will render its own content or redirect
  if (!isAuthenticated || user?.role !== "student") {
    return <RequireAuth role="student">{children}</RequireAuth>;
  }

  const studentNavbar = (
    <>
      <NavLink
        component={Link}
        href="/student/dashboard" // Link to the overview page
        label="🏠 Overview"
        leftSection={<IconHome size="1rem" stroke={1.5} />}
        active={pathname === "/student/dashboard"}
      />
      <NavLink
        component={Link}
        href="/student/dashboard/enrollments" // Link to the enrollments page
        label="📘 Enrollments"
        leftSection={<IconBook size="1rem" stroke={1.5} />}
        active={pathname === "/student/dashboard/enrollments"}
      />
      <NavLink
        component={Link}
        href="/student/dashboard/analytics" // Link to the analytics page
        label="📊 Quiz Results"
        leftSection={<IconChartBar size="1rem" stroke={1.5} />}
        active={pathname === "/student/dashboard/analytics"}
      />
    </>
  );

  return (
    <DashboardLayout title="Student Dashboard" navbar={studentNavbar}>
      {children}
    </DashboardLayout>
  );
};

export default StudentDashboardLayout;
