"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Loader,
  Button,
  Flex,
  Tooltip,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import Cookies from "js-cookie";

import QuizSection from "@/components/quiz/QuizSection";
import RequireAuth from "@/components/auth/RequireAuth";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [grade, setGrade] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resLesson = await sanctumGet(
          `/api/lessons/student-lessons/${id}`
        );
        setLesson(resLesson.data);

        const resGrade = await sanctumGet("/api/completed-lessons/grade");
        const match = resGrade.data.grades?.find((g) => g.lesson_id == id);
        if (match) setGrade(match.grade);
      } catch (err) {
        console.error("Lesson or grade fetch failed:", err);
        setGrade(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, sanctumGet]);

  if (loading) return <Loader />;
  if (!lesson) return <Text>Lesson not found</Text>;

  return (
    <RequireAuth role="student">
      <Container size="md" style={{ padding: "2rem" }}>
        <Flex justify="space-between" align="center" mt="sm" mb="md">
          <Button
            component={Link}
            href="/dashboard/student"
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
                component={Link}
                href={`/lessons/${lesson.previous_lesson.id}`}
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
                  component={Link}
                  href={`/lessons/${lesson.next_lesson.id}`}
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
            onSubmit={() => {
              setShowQuiz(false);
              setTimeout(() => window.location.reload(), 1000);
            }}
          />
        )}
      </Container>
    </RequireAuth>
  );
}
