"use client";

import { useEffect, useState } from "react";
import { Card, Table, Loader, Pagination, Group, Text } from "@mantine/core";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function CourseManager() {
  const { token } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/admin/courses?page=${page}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, page]);

  if (!token) {
    return (
      <Card padding="md" mt="md">
        <Loader />
        <Text mt="md" ta="center" c="dimmed">
          Authenticating course manager…
        </Text>
      </Card>
    );
  }

  return (
    <Card padding="md" mt="md">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Enrollments</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.instructor?.name || "—"}</td>
                  <td>{course.enrollments_count}</td>
                  <td>{course.is_published ? "Published" : "Draft"}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {meta?.last_page > 1 && (
            <Group justify="space-between" mt="md">
              <Text size="sm">
                Page {meta.current_page} of {meta.last_page}
              </Text>
              <Pagination
                value={page}
                onChange={setPage}
                total={meta.last_page}
                size="sm"
              />
            </Group>
          )}
        </>
      )}
    </Card>
  );
}
