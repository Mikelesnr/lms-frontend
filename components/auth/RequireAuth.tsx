"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Use useAuth from AuthContext
import { Center, Loader, Text } from "@mantine/core";

interface RequireAuthProps {
  children: React.ReactNode;
  role?: "admin" | "instructor" | "student"; // Optional role for specific access
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, role }) => {
  // Destructure user, isAuthenticated, and loading from useAuth
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If authentication is still loading, do nothing yet.
    if (authLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    // If a specific role is required and the user's role doesn't match, redirect to home or an unauthorized page
    if (role && user?.role !== role) {
      // You can redirect to home, login, or a dedicated unauthorized page
      router.replace("/"); // Redirect to home or another appropriate page
      return;
    }
    // If authenticated and role matches (or no role is required), allow rendering children.
  }, [authLoading, isAuthenticated, user, role, router]);

  // While authentication is loading, show a loader
  if (authLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
        <Text ml="md" c="dimmed">
          Verifying authentication...
        </Text>
      </Center>
    );
  }

  // If authenticated and authorized (or no role specified), render children.
  // This condition must match the checks in useEffect.
  if (isAuthenticated && (!role || user?.role === role)) {
    return <>{children}</>;
  }

  // If we reach here, it means redirection is pending or the user is unauthorized,
  // but the useEffect hasn't completed its navigation. Return null to avoid rendering
  // unauthorized content or a flash of incorrect UI.
  return null;
};

export default RequireAuth;
