"use client";

import useSWR from "swr";
import useSanctumRequest from "./useSanctumRequest";

export default function useEnrolledCourses() {
  const { sanctumGet } = useSanctumRequest();

  const fetcher = async (url) => {
    console.log("📡 useEnrolledCourses: fetching", url); // ✅ Log when fetch starts
    try {
      const response = await sanctumGet(url);
      console.log("✅ useEnrolledCourses: response", response.data); // ✅ Log data
      return response.data;
    } catch (err) {
      console.error("❌ useEnrolledCourses: fetch failed", err);
      throw err;
    }
  };

  const { data, error, isLoading } = useSWR("/api/enrollments/me", fetcher);

  return {
    courses: data || [],
    isLoading,
    error,
  };
}
