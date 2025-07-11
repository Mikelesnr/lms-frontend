"use client";

import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function useInstructorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/api/instructor/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch instructor stats:", err);
        notifications.show({
          title: "Stats Fetch Failed",
          message: "Unable to load instructor overview. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [token]);

  return {
    stats: stats ?? {
      total_students: 0,
      total_courses: 0,
      total_quizzes: 0,
    },
    loading,
  };
}
