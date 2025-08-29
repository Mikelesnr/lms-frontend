"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Title,
  Text,
  Button,
  Group,
  Card,
  Divider,
  Stack,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import api from "@/lib/api";
import AddQuestionModal from "./AddQuestionModal";
import AddAnswerModal from "./AddAnswerModal";
import AddQuizForm from "./AddQuizForm";

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

interface NewQuestion {
  id: number;
  question_text: string;
  answers: Answer[];
}

interface LessonQuizPanelProps {
  lessonId: number;
}

export default function LessonQuizPanel({ lessonId }: LessonQuizPanelProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [showAnswerModalFor, setShowAnswerModalFor] = useState<number | null>(
    null
  );
  const [showAddQuiz, setShowAddQuiz] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Quiz>(`/api/lessons/${lessonId}/quiz`);
      setQuiz(res.data);
      setNotFound(false);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object"
      ) {
        const response = (err as { response?: { status?: number } }).response;
        if (response?.status === 404) {
          setQuiz(null);
          setNotFound(true);
          setLoading(false);
          return;
        }
      }

      console.error("Failed to fetch quiz:", err);
      notifications.show({
        title: "Quiz Fetch Failed",
        message: "Unable to load quiz. Please try again later.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleQuestionAdded = (newQuestion: NewQuestion) => {
    setQuiz((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: [
          ...prev.questions,
          { ...newQuestion, answers: newQuestion.answers ?? [] },
        ],
      };
    });
    notifications.show({
      title: "Question Added",
      message: "Your question was added successfully.",
      color: "teal",
    });
  };

  const handleAnswerAdded = (questionId: number, newAnswer: Answer) => {
    setQuiz((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId
            ? { ...q, answers: [...(q.answers || []), newAnswer] }
            : q
        ),
      };
    });
    notifications.show({
      title: "Answer Added",
      message: "Your answer was saved.",
      color: "teal",
    });
  };

  if (loading) return <Loader mt="md" />;

  if (notFound) {
    return (
      <Box mt="md">
        <Text c="dimmed">No quiz available for this lesson.</Text>
        <Button
          size="xs"
          mt="xs"
          onClick={() => setShowAddQuiz(true)}
          aria-label="Add new quiz for lesson"
        >
          ➕ Add Quiz
        </Button>

        <AddQuizForm
          lessonId={lessonId}
          opened={showAddQuiz}
          onClose={() => setShowAddQuiz(false)}
          onCreated={(newQuiz) => {
            setQuiz({ ...newQuiz, questions: [] });
            setNotFound(false);
          }}
        />
      </Box>
    );
  }

  return (
    <Box mt="lg">
      <Group justify="space-between">
        <Title order={4}>📝 Quiz: {quiz?.title || "Untitled"}</Title>
        <Button
          onClick={() => setShowQuestionModal(true)}
          size="xs"
          aria-label="Add new quiz question"
        >
          ➕ Add Question
        </Button>
      </Group>

      {quiz?.questions?.map((q) => (
        <Card key={q.id} mt="md" padding="md" shadow="sm" radius="sm">
          <Group justify="space-between">
            <Text fw={500}>{q.question_text}</Text>
            <Button
              size="xs"
              onClick={() => setShowAnswerModalFor(q.id)}
              aria-label={`Add answer to question: ${q.question_text}`}
            >
              ➕ Add Answer
            </Button>
          </Group>
          <Divider my="sm" />
          <Stack gap="xs">
            {q.answers?.map((a) => (
              <Text
                key={a.id}
                size="sm"
                color={a.is_correct ? "green" : "dimmed"}
              >
                {a.answer_text} {a.is_correct && "✅"}
              </Text>
            ))}
          </Stack>
        </Card>
      ))}

      <AddQuestionModal
        quizId={quiz?.id || 0}
        opened={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        onSuccess={handleQuestionAdded}
      />

      <AddAnswerModal
        questionId={showAnswerModalFor}
        opened={!!showAnswerModalFor}
        onClose={() => setShowAnswerModalFor(null)}
        onSuccess={(answer) => {
          if (showAnswerModalFor !== null) {
            handleAnswerAdded(showAnswerModalFor, answer);
          }
        }}
      />
    </Box>
  );
}
