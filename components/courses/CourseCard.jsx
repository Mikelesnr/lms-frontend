"use client";

import { Card, Image, Text, Button, Badge, Group, Flex } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function CourseCard({ course, user }) {
  const [enrolled, setEnrolled] = useState(course.enrolled || false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { sanctumPost } = useSanctumRequest();

  const handleEnroll = async () => {
    if (!user) {
      alert("Please log in as a student to enroll.");
      router.push("/auth/login");
      return;
    }

    if (user.role !== "student") {
      alert("You must be logged in as a student to enroll.");
      return;
    }

    setLoading(true);

    try {
      await sanctumPost("/api/my/enrollments", { course_id: course.id });
      setEnrolled(true);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={course.image_url || "/placeholder.jpg"} height={140} />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600}>{course.title}</Text>
        <Badge color="teal" variant="light">
          {course.category || "General"}
        </Badge>
      </Group>

      <Text size="sm" c="dimmed" lineClamp={3}>
        {course.description}
      </Text>

      <Flex mt="md" justify="space-between">
        <Button
          variant="light"
          color="blue"
          size="xs"
          component={Link}
          href={`/courses/${course.id}`}
        >
          View Details
        </Button>

        {enrolled ? (
          <Badge color="green" size="sm" variant="filled">
            Enrolled
          </Badge>
        ) : (
          <Button
            variant="filled"
            color="teal"
            size="xs"
            loading={loading}
            onClick={handleEnroll}
          >
            Enroll
          </Button>
        )}
      </Flex>
    </Card>
  );
}
