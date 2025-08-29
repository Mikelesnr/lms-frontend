"use client";

import React, { useEffect, useState } from "react";
import { Loader, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import StudentOverviewCards from "@/components/student/OverviewCards";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

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
  return "Something went wrong while loading your progress.";
}

const StudentOverviewPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<number | null>(null);
  const [quizzes, setQuizzes] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const fetchStats = async () => {
        try {
          const [enrollRes, quizRes] = await Promise.all([
            api.get("/api/me/active-enrollments-count"),
            api.get("/api/me/completed-quizzes-count"),
          ]);

          const enrollmentCount = enrollRes.data?.active_enrollments ?? 0;
          const quizCount = quizRes.data?.completed_quizzes ?? 0;

          setEnrollments(enrollmentCount);
          setQuizzes(quizCount);

          notifications.show({
            title: "Progress Loaded",
            message: `You have ${enrollmentCount} enrollments and ${quizCount} completed quizzes.`,
            color: "teal",
            autoClose: 3000,
          });
        } catch (err: unknown) {
          console.error("❌ Failed to load overview stats:", err);
          const message = extractErrorMessage(err);
          setError(message);
          notifications.show({
            title: "Load Failed",
            message,
            color: "red",
          });
        }
      };

      fetchStats();
    }
  }, [authLoading, isAuthenticated, user]);

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        mt="md"
      >
        {error}
      </Alert>
    );
  }

  if (enrollments === null || quizzes === null || authLoading) {
    return <Loader mt="xl" />;
  }

  return <StudentOverviewCards enrollments={enrollments} quizzes={quizzes} />;
};

export default StudentOverviewPage;
