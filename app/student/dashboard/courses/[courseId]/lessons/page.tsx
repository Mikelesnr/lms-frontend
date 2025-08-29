"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Title,
  Box,
  Center,
  Loader,
  Alert,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconRefresh,
  IconPlayerPlay,
  IconCircleCheck,
  IconCircleDot,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lesson } from "@/types";

interface LessonDisplay extends Lesson {
  order: number;
  title: string;
  grade?: number | null;
}

interface CourseLessonsApiResponse {
  lessons: LessonDisplay[];
  next_lesson: LessonDisplay | null;
  course_title?: string;
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
  return "Could not load course lessons.";
}

export default function CourseLessonsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = typeof params?.courseId === "string" ? params.courseId : "";
  const parsedCourseId = parseInt(courseId, 10);

  const [courseTitle, setCourseTitle] = useState<string>("Loading Course...");
  const [lessons, setLessons] = useState<LessonDisplay[]>([]);
  const [nextLesson, setNextLesson] = useState<LessonDisplay | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const fetchLessonsData = useCallback(async () => {
    if (!authLoading && isAuthenticated && user) {
      setLoading(true);
      setLoadError(null);
      try {
        const response = await api.get<CourseLessonsApiResponse>(
          `/api/courses/${parsedCourseId}/lessons`
        );

        setLessons(response.data.lessons);
        setNextLesson(response.data.next_lesson);
        setCourseTitle(
          response.data.course_title || `Course ID ${parsedCourseId}`
        );

        notifications.show({
          title: "Lessons Loaded",
          message: `Lessons loaded for "${
            response.data.course_title || `Course ID ${parsedCourseId}`
          }".`,
          color: "teal",
          autoClose: 3000,
        });
      } catch (err: unknown) {
        console.error("❌ Error fetching course lessons:", err);
        setLessons([]);
        setNextLesson(null);
        const message = extractErrorMessage(err);
        setLoadError(message);
        notifications.show({
          title: "Load Failed",
          message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    }
  }, [authLoading, isAuthenticated, user, parsedCourseId]);

  useEffect(() => {
    if (isNaN(parsedCourseId)) {
      setLoadError("Invalid Course ID provided.");
      setLoading(false);
      return;
    }
    fetchLessonsData();
  }, [fetchLessonsData, parsedCourseId]);

  if (loading || authLoading) {
    return (
      <Center style={{ minHeight: "50vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Fetch error"
        color="red"
        mt="md"
        aria-label="Course lessons fetch error"
      >
        {loadError}
        <Button
          onClick={fetchLessonsData}
          mt="sm"
          leftSection={<IconRefresh size={16} />}
          variant="light"
        >
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Group justify="space-between" mb="md" align="center">
        <Title order={2}>Lessons for &ldquo;{courseTitle}&rdquo;</Title>
        <Button
          leftSection={<IconArrowLeft size={18} />}
          variant="default"
          onClick={() => router.push("/student/dashboard/enrollments")}
        >
          Back to Enrollments
        </Button>
      </Group>

      {nextLesson && (
        <Alert
          variant="light"
          color="blue"
          title="Your Next Lesson"
          icon={<IconPlayerPlay size={20} />}
          mb="xl"
          pr="sm"
        >
          <Group
            justify="space-between"
            align="center"
            style={{ width: "100%" }}
          >
            <Text fw={500} size="md">
              Lesson {nextLesson.order}: {nextLesson.title}
            </Text>
            <Button
              component={Link}
              href={`/student/dashboard/lessons/${nextLesson.id}`}
              size="sm"
              variant="filled"
              color="blue"
            >
              Resume This Lesson
            </Button>
          </Group>
        </Alert>
      )}

      {lessons.length === 0 ? (
        <Center mt="xl">
          <Text c="dimmed">No lessons found for this course yet.</Text>
        </Center>
      ) : (
        <List
          spacing="sm"
          size="lg"
          center
          icon={
            <ThemeIcon color="teal" size={24} radius="xl">
              <IconCircleDot size="1rem" />
            </ThemeIcon>
          }
        >
          {lessons.map((lesson) => {
            const isCompleted = nextLesson
              ? lesson.order < nextLesson.order
              : false;

            return (
              <List.Item
                key={lesson.id}
                icon={
                  isCompleted ? (
                    <ThemeIcon color="green" size={24} radius="xl">
                      <IconCircleCheck size="1rem" />
                    </ThemeIcon>
                  ) : (
                    <ThemeIcon color="blue" size={24} radius="xl">
                      <IconCircleDot size="1rem" />
                    </ThemeIcon>
                  )
                }
              >
                <Group
                  justify="space-between"
                  align="center"
                  style={{ width: "100%" }}
                >
                  <Text fw={500} size="lg">
                    Lesson {lesson.order}: {lesson.title}
                  </Text>
                  <Group>
                    {isCompleted && (
                      <Badge color="green" variant="light" size="sm">
                        Completed
                      </Badge>
                    )}
                    <Button
                      component={Link}
                      href={`/student/dashboard/lessons/${lesson.id}`}
                      size="xs"
                      variant="light"
                    >
                      View Lesson
                    </Button>
                  </Group>
                </Group>
              </List.Item>
            );
          })}
        </List>
      )}
    </Box>
  );
}
