"use client";

import { Card, Group, Title, Text, Badge, Button } from "@mantine/core";
import React from "react";

// Define a Lesson interface to type the lesson prop
interface Lesson {
  id: number;
  title: string;
  video_url?: string | null;
  content?: string | null;
}

// Define the props interface for LessonListItem
interface LessonListItemProps {
  lesson: Lesson;
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
  onSelect: (lesson: Lesson) => void;
}

const LessonListItem: React.FC<LessonListItemProps> = ({
  lesson,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <Card withBorder shadow="sm" mb="sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <div style={{ flex: 1 }}>
          <Title order={5} c="blue.8" mb="xs">
            {lesson.title}
          </Title>

          {lesson.video_url && (
            <Badge mt="xs" color="blue" variant="light">
              🎥 Video Available
            </Badge>
          )}

          {lesson.content && (
            <Text size="sm" mt="xs" c="dimmed" lineClamp={2}>
              {lesson.content}
            </Text>
          )}
        </div>

        <Group gap="xs">
          <Button
            size="xs"
            onClick={() => onSelect(lesson)}
            variant="default"
            color="gray"
          >
            View Details
          </Button>
          <Button size="xs" variant="light" onClick={() => onEdit(lesson)}>
            Edit
          </Button>
          <Button
            size="xs"
            color="red"
            variant="light"
            onClick={() => onDelete(lesson)}
          >
            Delete
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default LessonListItem;
