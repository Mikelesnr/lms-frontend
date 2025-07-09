"use client";

import { useState, useEffect } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function useQuizStats() {
  const { sanctumGet } = useSanctumRequest();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await sanctumGet("/api/instructor/quiz-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch quiz stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  });
  return { stats, loading };
}
