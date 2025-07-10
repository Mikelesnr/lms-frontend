"use client";

import useSWR from "swr";
import { useCallback } from "react";
import useSanctumRequest from "./useSanctumRequest";

export default function useEnrolledCourses() {
  const { sanctumGet } = useSanctumRequest();

  const fetcher = useCallback(
    async (url) => {
      console.log("📡 useEnrolledCourses: fetching", url);
      try {
        const response = await sanctumGet(url);
        console.log("✅ useEnrolledCourses: response", response.data);
        return response.data;
      } catch (err) {
        console.error("❌ useEnrolledCourses: fetch failed", err);
        throw err;
      }
    },
    [sanctumGet]
  );

  const { data, error, isLoading } = useSWR("/api/enrollments/me", fetcher);

  return {
    courses: data || [],
    isLoading,
    error,
  };
}
