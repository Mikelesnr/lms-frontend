"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Loader,
  Select,
  Text,
  Title,
  Group,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import api from "@/lib/api";

interface RawAnswer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean;
}

interface RawQuestion {
  id: number;
  quiz_id: number;
  question_text: string;
  order: number;
  answers: RawAnswer[];
}

interface RawQuiz {
  id: number;
  lesson_id: number;
  title: string;
  questions: RawQuestion[];
}

interface Question {
  id: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  lesson_id: number;
  questions: Question[];
}

export default function StudentQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId =
    typeof params === "object" && params !== null
      ? (params as Record<string, string>).quizId
      : undefined;

  const [quizData, setQuizData] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [grade, setGrade] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) {
        setError("Quiz ID is missing from the URL.");
        setLoading(false);
        return;
      }

      try {
        const res = await api.get<RawQuiz>(`/api/student/quizzes/${quizId}`);
        const raw = res.data;

        const transformed: Quiz = {
          id: raw.id,
          title: raw.title,
          description: "Auto-generated quiz",
          lesson_id: raw.lesson_id,
          questions: raw.questions.map((q) => {
            const correct =
              q.answers.find((a) => a.is_correct)?.answer_text ?? "";
            return {
              id: q.id,
              prompt: q.question_text,
              options: q.answers.map((a) => a.answer_text),
              correctAnswer: correct,
            };
          }),
        };

        setQuizData(transformed);
      } catch (err) {
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!quizData) return;

    const total = quizData.questions.length;
    let correct = 0;

    quizData.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedGrade = Math.round((correct / total) * 100);
    setGrade(calculatedGrade);
    setSubmitted(true);

    try {
      await api.post("/api/completed-lessons", {
        lesson_id: quizData.lesson_id,
        grade: calculatedGrade,
      });

      notifications.show({
        title: "Lesson Completed",
        message: `You scored ${calculatedGrade}% (${correct}/${total})`,
        color: "teal",
      });

      router.push(`/student/dashboard/lessons/${quizData.lesson_id}`);
    } catch (err) {
      notifications.show({
        title: "Submission Failed",
        message: "Could not submit your grade.",
        color: "red",
      });
    }
  };

  const handleReturnToLesson = () => {
    if (quizData) {
      router.push(`/student/dashboard/lessons/${quizData.lesson_id}`);
    }
  };

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Error"
        color="red"
        mt="md"
      >
        {error}
      </Alert>
    );
  }

  if (!quizData) {
    return (
      <Text mt="xl" ta="center" color="dimmed">
        Quiz not found.
      </Text>
    );
  }

  return (
    <Card mt="md" padding="lg">
      <Title order={2}>{quizData.title}</Title>
      <Text mt="sm" mb="lg" color="dimmed">
        {quizData.description}
      </Text>

      {quizData.questions.map((question) => (
        <Box key={question.id} mb="md">
          <Text fw={500}>{question.prompt}</Text>
          <Select
            data={question.options.map((opt) => ({ value: opt, label: opt }))}
            value={answers[question.id] || ""}
            onChange={(value) => handleAnswerChange(question.id, value || "")}
            disabled={submitted}
          />
          {submitted && (
            <Text
              mt="xs"
              size="sm"
              color={
                answers[question.id] === question.correctAnswer
                  ? "green"
                  : "red"
              }
            >
              {answers[question.id] === question.correctAnswer
                ? "✅ Correct"
                : `❌ Correct answer: ${question.correctAnswer}`}
            </Text>
          )}
        </Box>
      ))}

      <Group mt="xl">
        {!submitted && (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length !== quizData.questions.length}
          >
            Submit Quiz
          </Button>
        )}
        <Button variant="light" onClick={handleReturnToLesson}>
          Return to Lesson
        </Button>
      </Group>
    </Card>
  );
}
