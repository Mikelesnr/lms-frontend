"use client";

import React, { useEffect, useState } from "react";
import { Loader, Alert, Text, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import StudentQuizAnalytics from "@/components/student/QuizAnalytics";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { QuizAnalyticCourse } from "@/types";

const StudentQuizAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<QuizAnalyticCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Only fetch if authenticated and user object is available
    if (!authLoading && isAuthenticated && user) {
      const fetchAnalytics = async () => {
        try {
          const res = await api.get("/api/me/quiz-analytics");
          const data = res.data.quiz_analytics || [];

          setAnalytics(data);
          setLoadError(null);

          if (data.length > 0) {
            notifications.show({
              title: "Analytics Loaded",
              message: `You have quiz data for ${data.length} course${
                data.length > 1 ? "s" : ""
              }.`,
              color: "teal",
              autoClose: 3000,
            });
          }
        } catch (err) {
          console.error("❌ Error fetching quiz analytics:", err);
          setLoadError(
            "Unable to load quiz performance. Please try again later."
          );
          notifications.show({
            title: "Analytics Failed",
            message: "Unable to load quiz performance. Please try again later.",
            color: "red",
          });
        } finally {
          setLoading(false);
        }
      };

      fetchAnalytics();
    }
  }, [authLoading, isAuthenticated, user]);

  if (loading || authLoading) return <Loader mt="xl" />;

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Fetch error"
        color="red"
        mt="md"
        aria-label="Quiz analytics fetch error"
      >
        {loadError}
      </Alert>
    );
  }

  if (!analytics.length) {
    return (
      <Center mt="xl">
        <Text size="sm" c="dimmed" aria-label="Empty analytics fallback">
          No quiz data available yet.
        </Text>
      </Center>
    );
  }

  return <StudentQuizAnalytics analytics={analytics} />;
};

export default StudentQuizAnalyticsPage;
