"use client";

import { useState } from "react";
import { Table, Progress, Button, Flex, Text } from "@mantine/core";
import LessonView from "@/components/lesson/LessonView"; // 🔁 adjust path as needed

export default function EnrolledCoursesTable({ courses = [] }) {
  const [activeLessonId, setActiveLessonId] = useState(null);

  const handleReturnToCourses = () => setActiveLessonId(null);
  const handleSwitchLesson = (lessonId) => setActiveLessonId(lessonId);

  if (activeLessonId) {
    return (
      <LessonView
        id={activeLessonId}
        onReturnToCourses={handleReturnToCourses}
        onSwitchLesson={handleSwitchLesson}
      />
    );
  }

  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: 10 }}>Course</th>
          <th style={{ textAlign: "left", padding: 10 }}>Instructor</th>
          <th style={{ textAlign: "left", padding: 10 }}>Progress</th>
          <th style={{ textAlign: "left", padding: "0 30px" }}>Continue</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => {
          const progress = course.progress || 0;
          const nextLesson = course.next_lesson;

          return (
            <tr key={course.id}>
              <td>{course.title}</td>
              <td>{course.instructor?.name}</td>
              <td>
                <Flex align="center" gap="sm" style={{ maxWidth: 200 }}>
                  <Progress
                    value={progress}
                    size="sm"
                    radius="xl"
                    w="100%"
                    color={progress === 100 ? "green" : "blue"}
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
              <td style={{ alignContent: "center" }}>
                {progress === 100 ? (
                  <Text size="sm" color="green">
                    🎉 Completed
                  </Text>
                ) : (
                  <Button
                    size="xs"
                    variant="light"
                    color="blue"
                    style={{ margin: "5px 30px", textAlign: "center" }}
                    onClick={() => handleSwitchLesson(nextLesson?.id)}
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
}
