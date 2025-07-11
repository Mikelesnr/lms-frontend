"use client";

import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function useInstructorStudents(page = 1, perPage = 10) {
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/instructor/students?page=${page}&per_page=${perPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudents(res.data?.data ?? []);
        setMeta({
          total: res.data?.total ?? 0,
          current_page: res.data?.current_page ?? page,
          last_page: res.data?.last_page ?? 1,
        });

        if (!res.data?.data?.length) {
          notifications.show({
            title: "No Students Found",
            message: `No students returned on page ${page}.`,
            color: "orange",
          });
        }
      } catch (err) {
        console.error("Failed to fetch students", err);
        notifications.show({
          title: "Student Fetch Failed",
          message: "Unable to load instructor's student list.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, perPage, token]);

  return { students, meta, loading };
}
