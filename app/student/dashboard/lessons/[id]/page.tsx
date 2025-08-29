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
  Flex,
  Tooltip,
  Container,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconRefresh,
  IconQuestionMark,
  IconCheck,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Lesson, Quiz as QuizType } from "@/types";

interface LessonWithNavigation extends Lesson {
  previous_lesson?: { id: number; title: string; order_number: number } | null;
  next_lesson?: { id: number; title: string; order_number: number } | null;
  grade?: number | null;
  quiz?: QuizType | null;
}

interface GradesApiResponse {
  grades: {
    lesson_id: number;
    grade: number;
    updated_at: string;
  }[];
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
  return "Could not load lesson details.";
}

export default function LessonViewPage() {
  const router = useRouter();
  const params = useParams();
  const paramId = typeof params?.id === "string" ? params.id : "";
  const lessonId = parseInt(paramId, 10);

  const [currentLesson, setCurrentLesson] =
    useState<LessonWithNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoadError, setLessonLoadError] = useState<string | null>(null);
  const { loading: authLoading, isAuthenticated, user } = useAuth();

  const fetchLessonDetails = useCallback(async () => {
    setLessonLoadError(null);
    try {
      const response = await api.get<LessonWithNavigation>(
        `/api/lessons/student-lessons/${lessonId}`
      );
      setCurrentLesson({ ...response.data, grade: null });
      notifications.show({
        title: "Lesson Details Loaded",
        message: `Details for Lesson ${response.data.order_number} loaded.`,
        color: "teal",
        autoClose: 3000,
      });
    } catch (err: unknown) {
      console.error("❌ Error fetching lesson details:", err);
      setCurrentLesson(null);
      const message = extractErrorMessage(err);
      setLessonLoadError(message);
      notifications.show({
        title: "Load Failed",
        message,
        color: "red",
      });
      throw err;
    }
  }, [lessonId]);

  const fetchGrade = useCallback(async () => {
    if (!isAuthenticated || !user || isNaN(lessonId)) return;

    try {
      const gradesResponse = await api.get<GradesApiResponse>(
        "/api/completed-lessons/grade"
      );
      const gradeMatch = gradesResponse.data.grades.find(
        (g) => g.lesson_id === lessonId
      );

      setCurrentLesson((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          grade: gradeMatch ? gradeMatch.grade : null,
        };
      });
    } catch (err) {
      console.error("Grade fetch failed:", err);
    }
  }, [lessonId, isAuthenticated, user]);

  useEffect(() => {
    if (isNaN(lessonId)) {
      setLessonLoadError("Invalid Lesson ID provided.");
      setLoading(false);
      return;
    }

    const loadAllData = async () => {
      setLoading(true);
      if (!authLoading && isAuthenticated && user) {
        try {
          await fetchLessonDetails();
          await fetchGrade();
        } catch {
          // Error already handled inside fetchLessonDetails
        } finally {
          setLoading(false);
        }
      } else if (!authLoading && (!isAuthenticated || !user)) {
        router.replace("/auth/login");
        setLoading(false);
      }
    };

    loadAllData();
  }, [
    lessonId,
    authLoading,
    isAuthenticated,
    user,
    fetchLessonDetails,
    fetchGrade,
    router,
  ]);

  const isQuizCompleted = currentLesson?.grade != null;

  if (authLoading || loading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" />
      </Center>
    );
  }

  if (!isAuthenticated || user?.role !== "student") {
    router.replace("/auth/login");
    return null;
  }

  if (lessonLoadError) {
    return (
      <Center style={{ height: "50vh", flexDirection: "column" }}>
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error Loading Lesson"
          color="red"
          mt="md"
          aria-label="Lesson fetch error"
        >
          {lessonLoadError}
          <Button
            onClick={fetchLessonDetails}
            mt="sm"
            leftSection={<IconRefresh size={16} />}
            variant="light"
          >
            Retry
          </Button>
        </Alert>
        <Button
          onClick={() => router.back()}
          mt="md"
          leftSection={<IconArrowLeft size={16} />}
        >
          Go Back
        </Button>
      </Center>
    );
  }

  if (!currentLesson) {
    return (
      <Center mt="xl">
        <Text c="dimmed">Lesson not found or accessible.</Text>
      </Center>
    );
  }

  const handleReturnToCourseLessons = () => {
    if (currentLesson.course_id) {
      router.push(
        `/student/dashboard/courses/${currentLesson.course_id}/lessons`
      );
    } else {
      router.push("/student/dashboard/enrollments");
      notifications.show({
        title: "Navigation Issue",
        message: "Could not determine course, returning to enrollments.",
        color: "orange",
      });
    }
  };

  const handleSwitchLesson = (newLessonId: number) => {
    router.push(`/student/dashboard/lessons/${newLessonId}`);
  };

  return (
    <Container size="md" py="xl">
      <Flex justify="space-between" align="center" mt="sm" mb="md">
        <Button
          onClick={handleReturnToCourseLessons}
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
          size="xs"
        >
          Back to Course Lessons
        </Button>
        <Text size="sm" fw={600}>
          Grade:{" "}
          <span
            style={{ color: currentLesson.grade != null ? "teal" : "gray" }}
          >
            {currentLesson.grade != null ? `${currentLesson.grade}%` : "N/A"}
          </span>
        </Text>
      </Flex>

      <Group justify="space-between" mb="md" align="center">
        <Title order={2}>
          Lesson {currentLesson.order_number}: {currentLesson.title}
        </Title>
        <Group>
          {currentLesson.quiz?.id ? (
            <Button
              component={Link}
              href={`/student/dashboard/quizzes/${currentLesson.quiz.id}`}
              variant={isQuizCompleted ? "outline" : "filled"}
              color={isQuizCompleted ? "gray" : "teal"}
              leftSection={
                isQuizCompleted ? (
                  <IconCheck size={18} />
                ) : (
                  <IconQuestionMark size={18} />
                )
              }
              aria-label={isQuizCompleted ? "Quiz completed" : "Go to quiz"}
              disabled={isQuizCompleted}
            >
              {isQuizCompleted ? "Quiz Completed ✓" : "Quiz"}
            </Button>
          ) : (
            <Text c="dimmed" size="sm">
              No quiz available for this lesson.
            </Text>
          )}
        </Group>
      </Group>

      {currentLesson.video_url && (
        <Box mb="md">
          <iframe
            width="100%"
            height="315"
            src={
              currentLesson.video_url.includes("youtube.com/watch?v=")
                ? currentLesson.video_url.replace("watch?v=", "embed/")
                : currentLesson.video_url
            }
            title="Lesson video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "8px" }}
          ></iframe>
        </Box>
      )}

      <Text>{currentLesson.content}</Text>

      <Flex justify="space-between" align="center" mt="xl">
        {currentLesson.previous_lesson ? (
          <Tooltip label={currentLesson.previous_lesson.title} withArrow>
            <Button
              onClick={() =>
                handleSwitchLesson(currentLesson.previous_lesson!.id)
              }
              variant="light"
              size="sm"
              aria-label={`Go to previous lesson: ${currentLesson.previous_lesson.title}`}
            >
              ← Previous
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="default"
            size="sm"
            disabled
            aria-label="No previous lesson"
          >
            ← Previous
          </Button>
        )}

        {currentLesson.next_lesson ? (
          <Tooltip label={currentLesson.next_lesson.title} withArrow>
            <Button
              onClick={() => handleSwitchLesson(currentLesson.next_lesson!.id)}
              variant="light"
              size="sm"
              aria-label={`Go to next lesson: ${currentLesson.next_lesson.title}`}
            >
              Next →
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="light"
            size="sm"
            disabled
            aria-label="No next lesson"
          >
            Next →
          </Button>
        )}
      </Flex>
    </Container>
  );
}
