// components/instructor/lessons/LessonListItem.jsx
"use client";
import { Card, Group, Title, Text, Badge, Button } from "@mantine/core";

export default function LessonListItem({ lesson, onEdit, onDelete }) {
  return (
    <Card withBorder shadow="sm" mb="sm">
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={5}>{lesson.title}</Title>
          {lesson.video_url && (
            <Badge mt="xs" color="blue" variant="light">
              🎥 Video Available
            </Badge>
          )}
          {lesson.content && (
            <Text size="sm" mt="xs" c="dimmed">
              {lesson.content.slice(0, 100)}...
            </Text>
          )}
        </div>
        <Group>
          <Button size="xs" variant="light" onClick={onEdit}>
            Edit
          </Button>
          <Button size="xs" color="red" variant="light" onClick={onDelete}>
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
}
