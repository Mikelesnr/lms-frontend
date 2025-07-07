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

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
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
  }, [id]);

  if (loading) return <Loader />;
  if (!lesson) return <Text>Lesson not found</Text>;

  return (
    <Container size="md" style={{ padding: "2rem" }}>
      <Button
        component={Link}
        href="/dashboard/student"
        leftSection={<IconArrowLeft size={16} />}
        variant="light"
        size="xs"
        mt="sm"
      >
        Back to Courses
      </Button>

      <Title order={2}>{lesson.title}</Title>
      <Text mt="md">{lesson.content}</Text>

      {/* 🔁 Toggle video visibility */}
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
        {/* ← Previous Lesson */}
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
            <Button
              onClick={() => setShowQuiz(true)}
              variant="filled"
              color="teal"
              size="sm"
              disabled={quizCompleted}
            >
              {quizCompleted ? "Quiz Completed" : "Show Quiz →"}
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              No Quiz
            </Button>
          )}

          {/* → Next Lesson */}
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

      {showQuiz && (
        <QuizSection
          lessonId={lesson.id}
          onSubmit={() => {
            setShowQuiz(false);
            setQuizCompleted(true);
          }}
        />
      )}
    </Container>
  );
}
