"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Text,
  Button,
  Group,
  Card,
  Divider,
  Stack,
} from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";
import AddQuestionModal from "./AddQuestionModal";
import AddAnswerModal from "./AddAnswerModal";
import AddQuizForm from "./AddQuizForm";

export default function LessonQuizPanel({ lessonId }) {
  const { sanctumGet } = useSanctumRequest();
  const [quiz, setQuiz] = useState(null);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showAnswerModalFor, setShowAnswerModalFor] = useState(null);
  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      const res = await sanctumGet(`/api/lessons/${lessonId}/quiz`);
      setQuiz(res.data);
      setNotFound(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setQuiz(null);
        setNotFound(true);
      } else {
        console.error("Failed to fetch quiz:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const handleQuestionAdded = (newQuestion) => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const handleAnswerAdded = (questionId, newAnswer) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...(q.answers || []), newAnswer] }
          : q
      ),
    }));
  };

  if (loading) return null;

  if (notFound) {
    return (
      <Box mt="md">
        <Text c="dimmed">No quiz available for this lesson.</Text>
        <Button size="xs" mt="xs" onClick={() => setShowAddQuiz(true)}>
          ➕ Add Quiz
        </Button>

        <AddQuizForm
          lessonId={lessonId}
          opened={showAddQuiz}
          onClose={() => setShowAddQuiz(false)}
          onCreated={(newQuiz) => {
            setQuiz(newQuiz);
            setNotFound(false);
          }}
        />
      </Box>
    );
  }

  return (
    <Box mt="lg">
      <Group justify="space-between">
        <Title order={4}>🧪 Quiz: {quiz.title || "Untitled"}</Title>
        <Button onClick={() => setShowQuestionModal(true)} size="xs">
          ➕ Add Question
        </Button>
      </Group>

      {quiz.questions?.map((q) => (
        <Card key={q.id} mt="md" padding="md" shadow="sm" radius="sm">
          <Group justify="space-between">
            <Text fw={500}>{q.question_text}</Text>
            <Button size="xs" onClick={() => setShowAnswerModalFor(q.id)}>
              ➕ Add Answer
            </Button>
          </Group>
          <Divider my="sm" />
          <Stack spacing="xs">
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
        quizId={quiz.id}
        opened={showQuestionModal}
        onClose={() => setShowQuestionModal(false)}
        onSuccess={handleQuestionAdded}
      />

      <AddAnswerModal
        questionId={showAnswerModalFor}
        opened={!!showAnswerModalFor}
        onClose={() => setShowAnswerModalFor(null)}
        onSuccess={(answer) => handleAnswerAdded(showAnswerModalFor, answer)}
      />
    </Box>
  );
}
