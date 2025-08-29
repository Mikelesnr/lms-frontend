"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  Text,
  Loader,
  Button,
  Box,
  Group,
  Title,
  Alert,
} from "@mantine/core";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { notifications } from "@mantine/notifications";
import { Course } from "@/types";

import AddCourseForm from "@/components/instructor/AddCourseForm";
import EditCourseModal from "@/components/instructor/EditCourseModal";
import DeleteCourseConfirm from "@/components/instructor/DeleteCourseConfirm";
import {
  IconAlertCircle,
  IconExternalLink,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object"
  ) {
    const response = (err as { response?: { data?: unknown } }).response;
    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      typeof (response as { data?: unknown }).data === "object"
    ) {
      const data = (response as { data?: Record<string, unknown> }).data;
      if (data?.message && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return "Failed to load your courses.";
}

export default function InstructorCoursesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "instructor") {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.get<Course[]>("/api/courses");
        setCourses(res.data ?? []);
      } catch (err: unknown) {
        console.error("Failed to load courses", err);
        setCourses([]);
        const message = extractErrorMessage(err);
        setLoadError(message);
        notifications.show({
          title: "Courses Load Failed",
          message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEdit = (course: Course) => setEditingCourse(course);
  const handleDeleteModal = (course: Course) => setCourseToDelete(course);

  if (authLoading || loading) {
    return <Loader mt="xl" />;
  }

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error loading courses"
        color="red"
        mt="md"
      >
        {loadError}
      </Alert>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="md">
        <Title order={2}>📚 My Courses</Title>
        <AddCourseForm onSuccess={fetchCourses} />
      </Group>

      <EditCourseModal
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaved={fetchCourses}
      />

      <DeleteCourseConfirm
        course={courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onDeleted={fetchCourses}
      />

      {courses.length === 0 ? (
        <Text c="dimmed">You haven&#39;t created any courses yet.</Text>
      ) : (
        <Table striped withTableBorder highlightOnHover>
          <thead>
            <tr>
              <th>Course Title</th>
              <th>Description</th>
              <th style={{ textAlign: "center", padding: 10 }}>Details</th>
              <th style={{ textAlign: "center", padding: 10 }}>Edit</th>
              <th style={{ textAlign: "center", padding: 10 }}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td style={{ padding: 10 }}>{course.title}</td>
                <td style={{ padding: 10 }}>{course.description}</td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    leftSection={<IconExternalLink size={14} />}
                    component={Link}
                    href={`/instructor/dashboard/courses/${course.id}`}
                  >
                    View Details
                  </Button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    size="xs"
                    variant="light"
                    color="yellow"
                    leftSection={<IconEdit size={14} />}
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </Button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    leftSection={<IconTrash size={14} />}
                    onClick={() => handleDeleteModal(course)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Box>
  );
}
