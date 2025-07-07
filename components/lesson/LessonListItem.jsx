"use client";

import { Card, Group, Title, Text, Badge, Button } from "@mantine/core";

export default function LessonListItem({ lesson, onEdit, onDelete, onSelect }) {
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
          <Button size="xs" onClick={onSelect} variant="default" color="gray">
            View Details
          </Button>
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
