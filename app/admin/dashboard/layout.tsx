"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavLink, Loader, Center } from "@mantine/core";
import {
  IconHome,
  IconBook,
  IconUsers,
  IconUserCog,
} from "@tabler/icons-react";

import DashboardLayout from "@/components/layouts/DashboardLayout";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuth } from "@/context/AuthContext";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
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

  // If not authenticated or not an admin, RequireAuth will handle redirection
  if (!isAuthenticated || user?.role !== "admin") {
    return <RequireAuth role="admin">{children}</RequireAuth>;
  }

  const adminNavbar = (
    <>
      <NavLink
        component={Link}
        href="/admin/dashboard" // Link to the overview page
        label="🏠 Overview"
        leftSection={<IconHome size="1rem" stroke={1.5} />}
        active={pathname === "/admin/dashboard"}
      />
      <NavLink
        component={Link}
        href="/admin/dashboard/instructors" // Link to instructor management
        label="👨‍🏫 Instructors"
        leftSection={<IconUserCog size="1rem" stroke={1.5} />}
        active={pathname === "/admin/dashboard/instructors"}
      />
      <NavLink
        component={Link}
        href="/admin/dashboard/students" // Link to student management
        label="👩‍🎓 Students"
        leftSection={<IconUsers size="1rem" stroke={1.5} />}
        active={pathname === "/admin/dashboard/students"}
      />
      <NavLink
        component={Link}
        href="/admin/dashboard/courses" // Link to course management
        label="📘 Courses"
        leftSection={<IconBook size="1rem" stroke={1.5} />}
        active={pathname === "/admin/dashboard/courses"}
      />
    </>
  );

  return (
    <DashboardLayout title="Admin Dashboard" navbar={adminNavbar}>
      {children}
    </DashboardLayout>
  );
};

export default AdminDashboardLayout;
