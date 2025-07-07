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
import { IconAlertCircle } from "@tabler/icons-react";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

export default function StudentQuizAnalytics() {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { sanctumGet } = useSanctumRequest();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await sanctumGet("/api/me/quiz-analytics");
        setAnalytics(res.data.quiz_analytics || []);
      } catch (err) {
        console.error("❌ Error fetching quiz analytics:", err);
        setLoadError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <Loader mt="xl" />;
  if (loadError)
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title="Fetch error"
        color="red"
        mt="md"
      >
        Could not load quiz analytics. Please try again later.
      </Alert>
    );

  if (!analytics.length) {
    return <Text>No quiz data available yet.</Text>;
  }

  return (
    <Accordion variant="separated">
      {analytics.map((course) => (
        <Accordion.Item
          key={course.course_id}
          value={`course-${course.course_id}`}
        >
          <Accordion.Control>{course.course_title}</Accordion.Control>
          <Accordion.Panel>
            {course.lessons?.length > 0 ? (
              <Card withBorder mt="md">
                <Table striped highlightOnHover withTableBorder>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", paddingLeft: "12px" }}>
                        Lesson
                      </th>
                      <th style={{ textAlign: "left", paddingLeft: "12px" }}>
                        Score (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.lessons.map((lesson, i) => (
                      <tr key={i}>
                        <td style={{ paddingLeft: "12px" }}>{lesson.title}</td>
                        <td>{lesson.grade ?? "—"}</td>
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
