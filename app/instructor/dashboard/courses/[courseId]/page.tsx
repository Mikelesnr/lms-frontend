"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Title,
  Text,
  Paper,
  Divider,
  Loader,
  Stack,
  Button,
  Group,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Course, Lesson } from "@/types";
import LessonListItem from "@/components/lesson/LessonListItem";
import EditLessonModal from "@/components/lesson/EditLessonModal";
import DeleteLessonConfirm from "@/components/lesson/DeleteLessonConfirm";
import AddLessonForm from "@/components/lesson/AddLessonForm";
import LessonQuizPanel from "@/components/quiz/LessonQuizPanel";
import { useRouter } from "next/navigation";

interface CourseDetailsPageProps {
  params: Promise<{ courseId: string }>;
}

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
  return "Failed to load course details.";
}

export default function InstructorCourseDetailsPage({
  params,
}: CourseDetailsPageProps) {
  const { courseId } = React.use(params);
  const courseIdNumber = Number(courseId);

  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const fetchCourse = useCallback(async () => {
    if (!authLoading && isAuthenticated && user?.role === "instructor") {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await api.get<Course>(`/api/courses/${courseIdNumber}`);
        setCourse(res.data);
      } catch (err: unknown) {
        console.error("Failed to load course details:", err);
        setCourse(null);
        setLoadError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user, courseIdNumber]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  if (authLoading || loading) return <Loader mt="xl" />;

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        mt="md"
      >
        {loadError}
      </Alert>
    );
  }

  if (!course) {
    return <Text mt="xl">Course not found.</Text>;
  }

  return (
    <Box>
      <Button
        variant="subtle"
        size="xs"
        mb="sm"
        onClick={() => router.push("/instructor/dashboard/courses")}
      >
        ← Back to Courses
      </Button>

      <Title order={2} mb="xs">
        {course.title}
      </Title>
      <Text c="dimmed" mb="md">
        {course.description}
      </Text>

      <Group justify="space-between" mb="xs">
        <Divider my="sm" label="Lessons" labelPosition="left" />
        <Button
          size="xs"
          variant="light"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Hide Form" : "Add Lesson"}
        </Button>
      </Group>

      {showAddForm && (
        <Paper withBorder p="md" mb="md">
          <AddLessonForm
            courseId={course.id}
            onSuccess={() => {
              setShowAddForm(false);
              fetchCourse();
            }}
          />
        </Paper>
      )}

      {selectedLesson ? (
        <>
          <Group justify="space-between" mt="md" mb="xs">
            <Title order={4}>{selectedLesson.title}</Title>
            <Button
              size="xs"
              variant="light"
              onClick={() => setSelectedLesson(null)}
            >
              ⬅ Back to Lessons
            </Button>
          </Group>

          <LessonQuizPanel lessonId={selectedLesson.id} />
        </>
      ) : (
        <Stack>
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons
              .sort((a, b) => (a.order_number ?? 0) - (b.order_number ?? 0))
              .map((lesson) => (
                <LessonListItem
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => setLessonToEdit(lesson)}
                  onDelete={() => setLessonToDelete(lesson)}
                  onSelect={() => setSelectedLesson(lesson)}
                />
              ))
          ) : (
            <Text c="dimmed" mt="md">
              No lessons available for this course yet. Add one!
            </Text>
          )}
        </Stack>
      )}

      <EditLessonModal
        lesson={lessonToEdit}
        onClose={() => setLessonToEdit(null)}
        onSaved={fetchCourse}
      />

      <DeleteLessonConfirm
        lesson={lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onDeleted={fetchCourse}
      />
    </Box>
  );
}
