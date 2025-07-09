"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Loader,
  Button,
  Pagination,
  Group,
  Text,
} from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await sanctumGet(`/api/admin/courses?page=${page}`);
        setCourses(res.data.data); // Laravel wraps data here
        setMeta({
          current_page: res.data.current_page,
          last_page: res.data.last_page,
        });
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [page]);

  return (
    <Card padding="md" mt="md">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th style={{ width: "25%", textAlign: "left" }}>Title</th>
                <th style={{ width: "25%", textAlign: "left" }}>Instructor</th>
                <th style={{ width: "25%", textAlign: "left" }}>Enrollments</th>
                <th style={{ width: "25%", textAlign: "left" }}>Status</th>
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

          {meta && meta.last_page > 1 && (
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
