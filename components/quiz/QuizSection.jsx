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
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function QuizSection({ lessonId, onSubmit }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const { token } = useAuthStore();

  useEffect(() => {
    if (!lessonId || !token) return;

    const loadQuiz = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/lessons/${lessonId}/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
      } catch (err) {
        console.error("❌ Failed to load quiz:", err);
        notifications.show({
          title: "Quiz Load Failed",
          message: "Unable to fetch this quiz. Please try again later.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [lessonId, token]);

  const handleChange = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const calculateScoreClientSide = () => {
    let correct = 0;
    const total = quiz.questions.length;

    quiz.questions.forEach((q) => {
      const correctAnswer = q.answers.find((a) => a.is_correct);
      if (answers[q.id] === correctAnswer?.id) {
        correct++;
      }
    });

    return {
      score: Math.round((correct / total) * 100),
      correct,
      total,
    };
  };

  const handleSubmit = async () => {
    const { score, correct, total } = calculateScoreClientSide();
    const completionPayload = {
      lesson_id: lessonId,
      grade: score,
    };

    try {
      setSubmitting(true);
      await api.post("/api/completed-lessons", completionPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResult({ score, correct, total });
      notifications.show({
        title: "Quiz Submitted",
        message: `You scored ${score}% (${correct}/${total})`,
        color: "teal",
      });

      onSubmit?.();
    } catch (error) {
      console.error(
        "❌ Grade submission failed:",
        error.response?.data || error.message
      );
      notifications.show({
        title: "Submission Failed",
        message: "Your quiz score could not be saved. Please try again.",
        color: "orange",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingOverlay visible={true} overlayBlur={2} />;

  if (!quiz) return <Title order={4}>No quiz available for this lesson.</Title>;

  return (
    <Box mt="xl" pos="relative">
      <LoadingOverlay visible={submitting} overlayBlur={2} />

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
            value={answers[q.id] || null}
            onChange={(val) => handleChange(q.id, Number(val))}
            aria-label={`Answers for question ${index + 1}`}
          >
            <Stack mt="sm">
              {q.answers.map((a) => (
                <Radio key={a.id} value={a.id} label={a.answer_text} />
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
