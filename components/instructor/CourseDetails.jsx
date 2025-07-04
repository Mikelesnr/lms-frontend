"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Text,
  Paper,
  Divider,
  Loader,
  Stack,
  Badge,
} from "@mantine/core";
import api from "@/lib/api";

export default function CourseDetails({ id }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Failed to load course:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader mt="xl" />;
  if (!course) return <Text mt="xl">Course not found.</Text>;

  return (
    <Box>
      <Title order={2} mb="xs">
        {course.title}
      </Title>
      <Text c="dimmed" mb="md">
        {course.description}
      </Text>
      <Divider my="sm" label="Lessons" labelPosition="left" />

      <Stack>
        {course.lessons
          ?.sort((a, b) => a.order - b.order)
          .map((lesson, index) => (
            <Paper key={lesson.id} shadow="xs" p="md" radius="md">
              <Title order={5}>
                {index + 1}. {lesson.title}
              </Title>
              {lesson.video_url && (
                <Badge color="teal" mt="xs" size="sm">
                  🎥 Video Included
                </Badge>
              )}
              <Text mt="sm" lineClamp={3}>
                {lesson.content}
              </Text>
            </Paper>
          ))}
      </Stack>
    </Box>
  );
}
