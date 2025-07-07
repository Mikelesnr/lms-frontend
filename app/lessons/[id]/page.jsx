"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/api";
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
import QuizSection from "@/components/quiz/QuizSection";
import Cookies from "js-cookie";

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [grade, setGrade] = useState(null);

  useEffect(() => {
    // Load lesson content
    axios
      .get(`/api/lessons/student-lessons/${id}`)
      .then((res) => {
        setLesson(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching lesson:", err);
        setLoading(false);
      });

    // Load grade if it exists
    const token = Cookies.get("XSRF-TOKEN");
    if (!token) return;

    axios
      .get("/api/completed-lessons/grade", {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(token),
        },
      })
      .then((res) => {
        const match = res.data.grades?.find((g) => g.lesson_id == id);
        if (match) {
          setGrade(match.grade);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch grade:", err);
        setGrade(null);
      });
  }, [id]);

  if (loading) return <Loader />;
  if (!lesson) return <Text>Lesson not found</Text>;

  return (
    <Container size="md" style={{ padding: "2rem" }}>
      {/* Top navigation + grade */}
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

      {/* Navigation and quiz controls */}
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

      {/* Quiz section (hidden if already graded) */}
      {showQuiz && grade === null && (
        <QuizSection
          lessonId={lesson.id}
          onSubmit={() => {
            setShowQuiz(false);
            // Force grade refresh after quiz completion
            setTimeout(() => window.location.reload(), 1000);
          }}
        />
      )}
    </Container>
  );
}
