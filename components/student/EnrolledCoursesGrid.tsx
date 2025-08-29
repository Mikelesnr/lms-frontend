"use client";

import React from "react";
import { SimpleGrid, Center, Text } from "@mantine/core";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { Course } from "@/types";

interface EnrolledCoursesGridProps {
  courses: Course[];
}

const EnrolledCoursesGrid: React.FC<EnrolledCoursesGridProps> = ({
  courses = [],
}) => {
  if (courses.length === 0) {
    return (
      <Center mt="xl">
        <Text c="dimmed">You haven’t enrolled in any courses yet.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
      {courses.map((course) => (
        <EnrolledCourseCard
          key={course.id}
          course={{
            ...course,
            progress: course.progress ?? 0,
            instructor: course.instructor
              ? {
                  ...course.instructor,
                  email_verified_at: course.instructor.email_verified_at ?? "",
                }
              : undefined,
          }}
        />
      ))}
    </SimpleGrid>
  );
};

export default EnrolledCoursesGrid;
