"use client";

import React from "react";
import { Accordion, Table, Text, Card } from "@mantine/core";
import { QuizAnalyticCourse, Lesson } from "@/types";

interface StudentQuizAnalyticsProps {
  analytics: QuizAnalyticCourse[];
}

const StudentQuizAnalytics: React.FC<StudentQuizAnalyticsProps> = ({
  analytics,
}) => {
  return (
    <Accordion
      variant="separated"
      aria-label="Student quiz performance accordion"
    >
      {analytics.map((course) => (
        <Accordion.Item
          key={course.course_id}
          value={`course-${course.course_id}`}
        >
          <Accordion.Control aria-label={`Course ${course.course_title}`}>
            {course.course_title}
          </Accordion.Control>
          <Accordion.Panel>
            {course.lessons?.length > 0 ? (
              <Card withBorder mt="md" aria-label="Lesson performance card">
                <Table striped highlightOnHover withTableBorder>
                  <thead>
                    <tr>
                      <th
                        style={{ textAlign: "left", paddingLeft: "12px" }}
                        aria-label="Lesson name column"
                      >
                        Lesson
                      </th>
                      <th
                        style={{ textAlign: "left", paddingLeft: "12px" }}
                        aria-label="Score column"
                      >
                        Score (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.lessons.map((lesson: Lesson, i: number) => (
                      <tr key={i}>
                        <td style={{ paddingLeft: "12px" }}>{lesson.title}</td>
                        <td>
                          {lesson.grade !== null && lesson.grade !== undefined
                            ? lesson.grade
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            ) : (
              <Text size="sm" c="dimmed" mt="xs">
                No completed lessons for this course.
              </Text>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default StudentQuizAnalytics;
