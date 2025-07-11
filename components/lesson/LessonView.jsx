"use client";

import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Text,
  Loader,
  Button,
  Flex,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconArrowLeft } from "@tabler/icons-react";
import QuizSection from "@/components/quiz/QuizSection";
import { useLessonStore } from "@/lib/stores/useLessonStore";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function LessonView({ id, onReturnToCourses, onSwitchLesson }) {
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [grade, setGrade] = useState(null);

  const { lessons, setLesson } = useLessonStore();
  const { token } = useAuthStore();

  const lesson = lessons[id] ?? null;

  const fetchGrade = async () => {
    try {
      const resGrade = await api.get("/api/completed-lessons/grade", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const match = resGrade.data.grades?.find((g) => g.lesson_id == id);
      if (match) setGrade(match.grade);
    } catch (err) {
      console.error("Grade fetch failed:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!lesson) {
        try {
          const resLesson = await api.get(
            `/api/lessons/student-lessons/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setLesson(id, resLesson.data);
        } catch (err) {
          console.error("Lesson fetch failed:", err);
          notifications.show({
            title: "Error loading lesson",
            message: "Please try again later.",
            color: "red",
          });
        }
      }

      await fetchGrade();
      setLoading(false);
    };

    fetchData();
  }, [id, lesson, setLesson, token]);

  const handleQuizSubmit = async () => {
    setShowQuiz(false);
    notifications.show({
      title: "Quiz submitted",
      message: "Your response has been recorded.",
      color: "teal",
      autoClose: 3000,
    });

    await fetchGrade(); // re-fetch the grade and update the view
  };

  if (loading) return <Loader />;
  if (!lesson) return <Text>Lesson not found</Text>;

  return (
    <Container size="md" style={{ padding: "2rem" }}>
      <Flex justify="space-between" align="center" mt="sm" mb="md">
        <Button
          onClick={onReturnToCourses}
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
          size="xs"
        >
          Back to Courses
        </Button>
        <Text size="sm" fw={600}>
          Grade:{" "}
          <span style={{ color: grade !== null ? "teal" : "gray" }}>
            {grade !== null ? `${grade}%` : "N/A"}
          </span>
        </Text>
      </Flex>

      <Title order={2}>{lesson.title}</Title>
      <Text mt="md">{lesson.content}</Text>

      {!showQuiz && lesson.video_url && (
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%",
            height: 0,
            overflow: "hidden",
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <iframe
            src={lesson.video_url}
            title="Lesson Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      )}

      <Flex justify="space-between" mt="xl">
        {lesson.previous_lesson ? (
          <Tooltip label={lesson.previous_lesson.title} withArrow>
            <Button
              onClick={() => onSwitchLesson(lesson.previous_lesson.id)}
              variant="default"
              size="sm"
            >
              ← Previous
            </Button>
          </Tooltip>
        ) : (
          <Button variant="default" size="sm" disabled>
            ← Previous
          </Button>
        )}

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {lesson.quiz ? (
            grade !== null ? (
              <Button variant="outline" color="gray" size="sm" disabled>
                Quiz Completed ✓
              </Button>
            ) : (
              <Button
                onClick={() => setShowQuiz(true)}
                variant="filled"
                color="teal"
                size="sm"
              >
                Show Quiz →
              </Button>
            )
          ) : (
            <Button variant="outline" size="sm" disabled>
              No Quiz
            </Button>
          )}

          {lesson.next_lesson ? (
            <Tooltip label={lesson.next_lesson.title} withArrow>
              <Button
                onClick={() => onSwitchLesson(lesson.next_lesson.id)}
                variant="light"
                size="sm"
              >
                Next →
              </Button>
            </Tooltip>
          ) : (
            <Button variant="light" size="sm" disabled>
              Next →
            </Button>
          )}
        </div>
      </Flex>

      {showQuiz && grade === null && (
        <QuizSection
          lessonId={lesson.id}
          onSubmit={handleQuizSubmit}
          token={token}
        />
      )}
    </Container>
  );
}
