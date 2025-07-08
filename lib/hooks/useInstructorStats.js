"use client";

import { useState, useEffect } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function useInstructorStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await sanctumGet("/api/instructor/overview");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch instructor stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { stats, loading };
}
