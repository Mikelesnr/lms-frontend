"use client";

import React, { useCallback } from "react";
import {
  Card,
  Image,
  Text,
  Button,
  Badge,
  Group,
  Flex,
  Box,
  Progress,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { Course, Lesson } from "@/types";

interface EnrolledCourseCardCourse extends Course {
  progress: number;
  next_lesson?: Lesson;
  instructor?: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "instructor" | "student";
    email_verified_at: string;
    courses_count: number;
  };
}

interface EnrolledCourseCardProps {
  course: EnrolledCourseCardCourse;
}

const EnrolledCourseCard: React.FC<EnrolledCourseCardProps> = ({ course }) => {
  const router = useRouter();
  const progress = typeof course.progress === "number" ? course.progress : 0;

  const handleResumeClick = useCallback(() => {
    notifications.show({
      title: "Viewing Course Lessons",
      message: `Navigating to lessons for "${course.title}".`,
      color: "teal",
    });
    router.push(`/student/dashboard/courses/${course.id}/lessons`);
  }, [course.id, course.title, router]);

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={course.image_url || "/placeholder.jpg"}
          height={140}
          alt={`Image for ${course.title}`}
          fit="cover"
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600} size="lg" lineClamp={1}>
          {course.title}
        </Text>
        <Badge color="blue" variant="light">
          {course.category || "General"}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={2}>
        {course.description}
      </Text>

      <Flex direction="column" mt="md" gap="xs">
        <Text size="sm">
          <strong>Instructor:</strong> {course.instructor?.name ?? "—"}
        </Text>

        <Box>
          <Text size="sm" mb={4}>
            <strong>Progress:</strong>
          </Text>
          <Flex align="center" gap="sm">
            <Progress
              value={progress}
              size="sm"
              radius="xl"
              w="100%"
              color={progress === 100 ? "green" : "blue"}
              aria-label={`Progress: ${progress}%`}
            />
            <Text size="sm" c={progress === 100 ? "green" : "dimmed"} fw={500}>
              {progress}%
            </Text>
          </Flex>
        </Box>
      </Flex>

      <Group justify="flex-end" mt="md">
        {progress === 100 ? (
          <Badge color="green" size="md" variant="filled">
            Completed
          </Badge>
        ) : (
          <Button
            size="sm"
            variant="light"
            color="blue"
            onClick={handleResumeClick}
            aria-label={`View lessons for ${course.title}`}
          >
            Resume Course
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default EnrolledCourseCard;
