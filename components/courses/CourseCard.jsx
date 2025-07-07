import { Card, Image, Text, Button, Badge, Group, Flex } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(course.enrolled || false);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    const xsrf = Cookies.get("XSRF-TOKEN");
    const session = Cookies.get("lms_learning_system_session");

    setLoading(true);
    try {
      await api.post(
        "/api/my/enrollments",
        { course_id: course.id },
        {
          withCredentials: true,
          headers: {
            "X-XSRF-TOKEN": decodeURIComponent(xsrf),
          },
        }
      );
      setEnrolled(true);
    } catch (err) {
      console.error("Enrollment failed:", err);
      if (err.response?.status === 403) {
        alert(err.response.data?.message || "You must be a student to enroll.");
      }
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
