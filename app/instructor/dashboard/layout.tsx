"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavLink, Loader, Center } from "@mantine/core";
import {
  IconHome,
  IconBook,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

interface InstructorDashboardLayoutProps {
  children: React.ReactNode;
}

const InstructorDashboardLayout: React.FC<InstructorDashboardLayoutProps> = ({
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

  // If not authenticated or not an instructor, RequireAuth will handle redirection
  if (!isAuthenticated || user?.role !== "instructor") {
    return <RequireAuth role="instructor">{children}</RequireAuth>;
  }

  const instructorNavbar = (
    <>
      <NavLink
        component={Link}
        href="/instructor/dashboard" // Link to the overview page
        label="🏠 Overview"
        leftSection={<IconHome size="1rem" stroke={1.5} />}
        active={pathname === "/instructor/dashboard"}
      />
      <NavLink
        component={Link}
        href="/instructor/dashboard/courses" // Link to course management
        label="📚 My Courses"
        leftSection={<IconBook size="1rem" stroke={1.5} />}
        active={pathname.startsWith("/instructor/dashboard/courses")} // Use startsWith for nested routes
      />
      <NavLink
        component={Link}
        href="/instructor/dashboard/analytics" // Link to quiz analytics
        label="📊 Quiz Analytics"
        leftSection={<IconChartBar size="1rem" stroke={1.5} />}
        active={pathname === "/instructor/dashboard/analytics"}
      />
      <NavLink
        component={Link}
        href="/instructor/dashboard/students" // Link to student management
        label="👥 Students"
        leftSection={<IconUsers size="1rem" stroke={1.5} />}
        active={pathname === "/instructor/dashboard/students"}
      />
    </>
  );

  return (
    <DashboardLayout title="Instructor Dashboard" navbar={instructorNavbar}>
      {children}
    </DashboardLayout>
  );
};

export default InstructorDashboardLayout;
