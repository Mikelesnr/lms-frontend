"use client";
import { Card, Title, Text, Stack, Badge, Group, Button } from "@mantine/core";

export default function LessonQuizPanel({ quiz, onEdit, onDelete }) {
  return (
    <Card withBorder shadow="sm" p="md" mt="md">
      <Group justify="space-between">
        <Title order={5}>{quiz.title || "Untitled Quiz"}</Title>
        <Group>
          <Button size="xs" onClick={() => onEdit(quiz)}>
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            variant="light"
            onClick={() => onDelete(quiz)}
          >
            Delete
          </Button>
        </Group>
      </Group>

      <Stack mt="sm">
        {quiz.questions?.map((q, qi) => (
          <Card key={q.id} withBorder radius="sm" p="sm" mt="xs">
            <Text fw={500}>
              {qi + 1}. {q.text}
            </Text>
            <Stack mt="xs">
              {q.answers?.map((a, ai) => (
                <Badge
                  key={a.id}
                  color={a.is_correct ? "green" : "gray"}
                  variant="light"
                >
                  {String.fromCharCode(65 + ai)}. {a.text}
                </Badge>
              ))}
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
