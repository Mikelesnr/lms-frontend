"use client";

import {
  Card,
  Image,
  Text,
  Button,
  Badge,
  Group,
  Flex,
  Box,
  Alert,
} from "@mantine/core";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CourseDetailsModal from "@/components/courses/CourseDetailsModal";
import api from "@/lib/api";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  // Ensure initial values are literal booleans, not the 'boolean' type itself
  const [enrolled, setEnrolled] = useState<boolean>(course.enrolled ?? false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // Ensure initial value is null or a string, not the 'string | null' type
  const [enrollmentMessage, setEnrollmentMessage] = useState<string | null>(
    null
  );

  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const handleEnroll = async () => {
    setEnrollmentMessage(null);

    if (!isAuthenticated) {
      setEnrollmentMessage("Please log in as a student to enroll.");
      router.push("/auth/login");
      return;
    }

    if (user?.role !== "student") {
      setEnrollmentMessage("Only students can enroll in courses.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/my/enrollments", { course_id: course.id });
      setEnrolled(true);
      setEnrollmentMessage(`You're now enrolled in "${course.title}"!`);
    } catch (err) {
      console.error("Enrollment failed:", err);
      // More specific error handling could go here based on API response
      setEnrollmentMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{
          height: 360,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Card.Section>
          <Image
            src={course.image_url || "/placeholder.jpg"} // Use course.image_url, with fallback
            height={140}
            alt={`Image for ${course.title}`} // Added alt text for accessibility
          />
        </Card.Section>

        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={600} size="md" lineClamp={1}>
            {course.title}
          </Text>
          <Badge color="teal" variant="light">
            {course.category || "General"}
          </Badge>
        </Group>

        <Box style={{ flexGrow: 1 }}>
          <Text size="sm" c="dimmed" lineClamp={3}>
            {course.description}
          </Text>
        </Box>

        <Box mt="md">
          <Flex justify="space-between">
            <Button
              variant="light"
              color="blue"
              size="xs"
              onClick={() => setModalOpen(true)}
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
                disabled={!isAuthenticated || user?.role !== "student"}
              >
                Enroll
              </Button>
            )}
          </Flex>
        </Box>
      </Card>

      {enrollmentMessage && (
        <Alert
          title={enrollmentMessage.includes("enrolled") ? "Success" : "Error"}
          color={enrollmentMessage.includes("enrolled") ? "green" : "red"}
          onClose={() => setEnrollmentMessage(null)}
          withCloseButton
          mt="md"
        >
          {enrollmentMessage}
        </Alert>
      )}

      <CourseDetailsModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        course={course}
      />
    </>
  );
};

export default CourseCard;
