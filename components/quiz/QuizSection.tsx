"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Radio,
  Stack,
  Title,
  LoadingOverlay,
  Flex,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "@/lib/api";

interface Answer {
  id: number;
  answer_text: string;
  is_correct: boolean;
}

interface Question {
  id: number;
  question_text: string;
  answers: Answer[];
}

interface Quiz {
  id: number;
  lesson_id: number;
  title: string;
  questions: Question[];
}

interface QuizResult {
  score: number;
  correct: number;
  total: number;
}

interface QuizSectionProps {
  lessonId: number;
  onSubmit?: () => void;
}

export default function QuizSection({ lessonId, onSubmit }: QuizSectionProps) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get<Quiz>(`/api/lessons/${lessonId}/quiz`);
        setQuiz(res.data);
      } catch (err: unknown) {
        console.error("❌ Failed to load quiz:", err);

        let message = "Unable to fetch this quiz. Please try again later.";

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          typeof (err as { response?: unknown }).response === "object"
        ) {
          const response = (err as { response?: { data?: unknown } }).response;
          if (
            response &&
            "data" in response &&
            typeof response.data === "object" &&
            response.data !== null &&
            "message" in response.data &&
            typeof (response.data as { message?: unknown }).message === "string"
          ) {
            message = (response.data as { message: string }).message;
          }
        }

        notifications.show({
          title: "Quiz Load Failed",
          message,
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId]);

  const handleChange = (questionId: number, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const calculateScoreClientSide = (): QuizResult => {
    let correct = 0;
    const total = quiz?.questions.length || 0;

    quiz?.questions.forEach((q) => {
      const correctAnswer = q.answers.find((a) => a.is_correct);
      if (answers[q.id] === correctAnswer?.id) {
        correct++;
      }
    });

    return {
      score: total > 0 ? Math.round((correct / total) * 100) : 0,
      correct,
      total,
    };
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const { score, correct, total } = calculateScoreClientSide();
    const completionPayload = {
      lesson_id: lessonId,
      grade: score,
    };

    try {
      setSubmitting(true);
      await api.post("/api/completed-lessons", completionPayload);

      setResult({ score, correct, total });
      notifications.show({
        title: "Quiz Submitted",
        message: `You scored ${score}% (${correct}/${total})`,
        color: "teal",
      });

      onSubmit?.();
    } catch (error: unknown) {
      console.error("❌ Grade submission failed:", error);

      let message = "Your quiz score could not be saved. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: unknown }).response === "object"
      ) {
        const response = (error as { response?: { data?: unknown } }).response;
        if (
          response &&
          "data" in response &&
          typeof response.data === "object" &&
          response.data !== null &&
          "message" in response.data &&
          typeof (response.data as { message?: unknown }).message === "string"
        ) {
          message = (response.data as { message: string }).message;
        }
      }

      notifications.show({
        title: "Submission Failed",
        message,
        color: "orange",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />;

  if (!quiz) return <Title order={4}>No quiz available for this lesson.</Title>;

  return (
    <Box mt="xl" pos="relative">
      <LoadingOverlay visible={submitting} overlayProps={{ blur: 2 }} />

      <Title order={3} mb="lg">
        Quiz: {quiz.title}
      </Title>

      {quiz.questions.map((q, index) => (
        <Box key={q.id} mb="lg">
          <Title order={5}>
            {index + 1}. {q.question_text}
          </Title>
          <Radio.Group
            name={`question-${q.id}`}
            value={answers[q.id]?.toString() ?? ""}
            onChange={(val) => handleChange(q.id, Number(val))}
            aria-label={`Answers for question ${index + 1}`}
          >
            <Stack mt="sm">
              {q.answers.map((a) => (
                <Radio
                  key={a.id}
                  value={a.id.toString()}
                  label={a.answer_text}
                />
              ))}
            </Stack>
          </Radio.Group>
        </Box>
      ))}

      {!result ? (
        <Button
          onClick={handleSubmit}
          loading={submitting}
          disabled={Object.keys(answers).length !== quiz.questions.length}
          aria-label="Submit completed quiz"
        >
          Submit Quiz
        </Button>
      ) : (
        <Box mt="md">
          <Title order={4}>
            ✅ You scored {result.score}% ({result.correct}/{result.total}{" "}
            correct)
          </Title>
          <Flex mt="sm" gap="sm">
            <Button
              onClick={() => router.refresh()}
              variant="default"
              aria-label="Refresh Lesson"
            >
              Refresh Lesson
            </Button>
            {onSubmit && (
              <Button
                onClick={onSubmit}
                variant="filled"
                color="teal"
                aria-label="Back to Lesson"
              >
                ← Back to Lesson
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
