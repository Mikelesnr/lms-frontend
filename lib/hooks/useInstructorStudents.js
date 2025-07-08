"use client";

import { useEffect, useState } from "react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function useInstructorStudents(page = 1, perPage = 10) {
  const { sanctumGet } = useSanctumRequest();
  const [students, setStudents] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    current_page: 1,
    last_page: 1,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await sanctumGet(
          `/api/instructor/students?page=${page}&per_page=${perPage}`
        );

        setStudents(res.data.data); // ✅ fixed: extract actual records array
        setMeta({
          total: res.data.total,
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        });
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, perPage]);

  return { students, meta, loading };
}
