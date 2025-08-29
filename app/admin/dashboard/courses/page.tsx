"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Loader,
  Pagination,
  Group,
  Text,
  Alert,
  Title,
  Center,
  Flex,
} from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { Course, Instructor } from "@/types";
import { IconAlertCircle } from "@tabler/icons-react";

// Extend Course type for properties expected in the table
interface AdminCourse extends Course {
  enrollments_count: number;
  instructor?: Instructor;
}

interface CoursePaginationMeta {
  current_page: number;
  last_page: number;
}

export default function AdminCoursesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<CoursePaginationMeta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "admin") {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{
          data: AdminCourse[];
          current_page: number;
          last_page: number;
        }>(`/api/admin/courses?page=${page}`);
        setCourses(res.data?.data ?? []);
        setMeta({
          current_page: res.data?.current_page ?? 1,
          last_page: res.data?.last_page ?? 1,
        });
      } catch (err: unknown) {
        console.error("Failed to fetch courses:", err);

        let message = "Failed to load courses.";
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: { data?: { message?: string } } })
            .response?.data?.message === "string"
        ) {
          message = (err as { response?: { data?: { message?: string } } })
            .response!.data!.message!;
        } else if (err instanceof Error) {
          message = err.message || message;
        }

        setError(message);
        setCourses([]);
        setMeta(null);

        notifications.show({
          title: "Fetch Failed",
          message: "Unable to load courses. Please try again.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [page, authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (authLoading) {
    return (
      <Card padding="md" mt="md" radius="md">
        <Loader />
        <Text mt="md" ta="center" c="dimmed">
          Authenticating course manager…
        </Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        title="Error"
        color="red"
        mt="md"
        icon={<IconAlertCircle size={16} />}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card padding="md" mt="md" radius="md">
      <Flex justify="space-between" align="center" mb="lg">
        <Title order={3}>Managed Courses</Title>
      </Flex>
      {loading ? (
        <Center mih={200}>
          <Loader />
        </Center>
      ) : (
        <>
          {courses.length === 0 ? (
            <Alert color="yellow" title="No Courses Found" mt="md">
              There are no courses to display in the system.
            </Alert>
          ) : (
            <Table
              striped
              highlightOnHover
              withColumnBorders
              verticalSpacing="sm"
              fz="sm"
            >
              <thead>
                <tr>
                  <th
                    style={{
                      width: "40%",
                      textAlign: "left",
                      paddingLeft: "var(--mantine-spacing-md)",
                    }}
                  >
                    Title
                  </th>
                  <th style={{ width: "25%", textAlign: "left" }}>
                    Instructor
                  </th>
                  <th style={{ width: "15%", textAlign: "center" }}>
                    Enrollments
                  </th>
                  <th style={{ width: "20%", textAlign: "center" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td style={{ paddingLeft: "var(--mantine-spacing-md)" }}>
                      {course.title}
                    </td>
                    <td>{course.instructor?.name || "—"}</td>
                    <td style={{ textAlign: "center" }}>
                      {course.enrollments_count}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Text
                        size="sm"
                        c={course.is_published ? "green.6" : "orange.6"}
                        fw={500}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

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
                radius="md"
              />
            </Group>
          )}
        </>
      )}
    </Card>
  );
}
