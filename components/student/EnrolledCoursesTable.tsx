"use client";

import React, { useState } from "react";
import {
  Table,
  Progress,
  Button,
  Flex,
  Text,
  Badge,
  Center,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import LessonView from "@/components/lesson/LessonView";
import { Course, Lesson } from "@/types";

// Extend Course type for additional properties expected in the table row
interface EnrolledCourseTableCourse extends Course {
  progress: number;
  next_lesson?: Lesson;
}

interface EnrolledCoursesTableProps {
  courses: EnrolledCourseTableCourse[];
}

const EnrolledCoursesTable: React.FC<EnrolledCoursesTableProps> = ({
  courses = [],
}) => {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  const handleReturnToCourses = () => setActiveLessonId(null);

  const handleSwitchLesson = (
    lessonId: number | undefined,
    courseTitle: string
  ) => {
    if (lessonId === undefined) {
      notifications.show({
        title: "No Next Lesson",
        message: `There's no next lesson available for "${courseTitle}".`,
        color: "orange",
      });
      return;
    }
    notifications.show({
      title: "Lesson Opened",
      message: `Opening next lesson from "${courseTitle}".`,
      color: "teal",
    });
    setActiveLessonId(lessonId);
  };

  if (activeLessonId) {
    return (
      <LessonView
        id={activeLessonId}
        onReturnToCourses={handleReturnToCourses}
        onSwitchLesson={(lessonId: number) => setActiveLessonId(lessonId)}
      />
    );
  }

  if (courses.length === 0) {
    return (
      <Center mt="xl">
        <Text c="dimmed">You haven’t enrolled in any courses yet.</Text>
      </Center>
    );
  }

  return (
    <Table striped highlightOnHover withTableBorder>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "10px" }}>📘 Course</th>
          <th style={{ textAlign: "left", padding: "10px" }}>🧑‍🏫 Instructor</th>
          <th style={{ textAlign: "left", padding: "10px" }}>📈 Progress</th>
          <th style={{ textAlign: "center", padding: "10px" }}>▶️ Continue</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => {
          const progress = course.progress || 0;
          const nextLesson = course.next_lesson;

          return (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.instructor?.name ?? "—"}</td>
              <td>
                <Flex align="center" gap="sm" style={{ maxWidth: 220 }}>
                  <Progress
                    value={progress}
                    size="sm"
                    radius="xl"
                    w="100%"
                    color={progress === 100 ? "green" : "blue"}
                    aria-label={`Progress: ${progress}%`}
                  />
                  <Text
                    size="sm"
                    c={progress === 100 ? "green" : "dimmed"}
                    fw={500}
                  >
                    {progress}%
                  </Text>
                </Flex>
              </td>
              <td style={{ textAlign: "center" }}>
                {progress === 100 ? (
                  <Badge color="green" size="sm" variant="light">
                    Completed
                  </Badge>
                ) : (
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    onClick={() =>
                      handleSwitchLesson(nextLesson?.id, course.title)
                    }
                    aria-label={`Resume ${course.title}`}
                    disabled={!nextLesson?.id}
                  >
                    Resume
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default EnrolledCoursesTable;
