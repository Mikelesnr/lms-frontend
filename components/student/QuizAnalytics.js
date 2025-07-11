"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  Table,
  Text,
  Box,
  Card,
  Loader,
  Alert,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function StudentQuizAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/api/me/quiz-analytics", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.quiz_analytics || [];

        setAnalytics(data);

        if (data.length > 0) {
          notifications.show({
            title: "Analytics Loaded",
            message: `You have quiz data for ${data.length} course${
              data.length > 1 ? "s" : ""
            }.`,
            color: "teal",
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error("❌ Error fetching quiz analytics:", err);
        setLoadError(err);
        notifications.show({
          title: "Analytics Failed",
          message: "Unable to load quiz performance. Please try again later.",
          color: "red",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [token]);

  if (loading) return <Loader mt="xl" />;

  if (loadError) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Fetch error"
        color="red"
        mt="md"
        aria-label="Quiz analytics fetch error"
      >
        Could not load quiz analytics. Please try again later.
      </Alert>
    );
  }

  if (!analytics.length) {
    return (
      <Text size="sm" c="dimmed" mt="md" aria-label="Empty analytics fallback">
        No quiz data available yet.
      </Text>
    );
  }

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
                    {course.lessons.map((lesson, i) => (
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
}
