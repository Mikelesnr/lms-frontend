"use client";

import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function useQuizStats() {
  const [stats, setStats] = useState({
    total_quizzes: 0,
    average_score: 0,
    students_completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/instructor/quiz-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data) {
          notifications.show({
            title: "No Quiz Stats Found",
            message: "No quiz data was returned.",
            color: "orange",
          });
        }

        setStats(res.data ?? stats);
      } catch (err) {
        console.error("Failed to fetch quiz stats:", err);
        notifications.show({
          title: "Fetch Failed",
          message: "Unable to load quiz analytics. Please try again later.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  return { stats, loading };
}
