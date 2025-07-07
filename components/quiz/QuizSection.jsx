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
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function QuizSection({ lessonId, onSubmit }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  const loadQuiz = async () => {
    if (!lessonId) return;

    const token = Cookies.get("XSRF-TOKEN");
    if (!token) {
      console.warn("Missing CSRF token while loading quiz");
      return;
    }

    try {
      const res = await api.get(`/api/lessons/${lessonId}/quiz`, {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(token),
        },
      });

      setQuiz(res.data);
    } catch (err) {
      console.error("❌ Failed to load quiz:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (questionId, answerId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleSubmit = async () => {
    const token = Cookies.get("XSRF-TOKEN");
    if (!token) {
      console.warn("Missing CSRF token during submission");
      return;
    }

    const { score, correct, total } = calculateScoreClientSide();

    const completionPayload = {
      lesson_id: lessonId,
      grade: score,
    };

    console.log("📤 Submitting grade payload:", completionPayload);

    try {
      setSubmitting(true);

      const res = await api.post("/api/completed-lessons", completionPayload, {
        withCredentials: true,
        headers: {
          "X-XSRF-TOKEN": decodeURIComponent(token),
        },
      });

      console.log("✅ Lesson marked complete:", res.data);

      setResult({ score, correct, total });
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error(
        "❌ Grade submission failed:",
        error.response?.data || error.message
      );
    } finally {
      setSubmitting(false);
    }
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

    const score = Math.round((correct / total) * 100);
    return { score, correct, total };
  };

  if (loading) return <LoadingOverlay visible />;
  if (!quiz) return <Title order={4}>No quiz available for this lesson.</Title>;

  return (
    <Box mt="xl">
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
            <Button onClick={() => router.refresh()} variant="default">
              Refresh Lesson
            </Button>
            {onSubmit && (
              <Button onClick={onSubmit} variant="filled" color="teal">
                ← Back to Lesson
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
