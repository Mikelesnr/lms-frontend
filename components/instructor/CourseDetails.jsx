"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Title,
  Text,
  Paper,
  Divider,
  Loader,
  Stack,
  Button,
  Group,
} from "@mantine/core";

import LessonListItem from "@/components/lesson/LessonListItem";
import EditLessonModal from "@/components/lesson/EditLessonModal";
import DeleteLessonConfirm from "@/components/lesson/DeleteLessonConfirm";
import AddLessonForm from "@/components/lesson/AddLessonForm";
import LessonQuizPanel from "@/components/quiz/LessonQuizPanel";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import api from "@/lib/api";

export default function CourseDetails({ id }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const { token } = useAuthStore();

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course:", err);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id, token]);

  if (loading) return <Loader mt="xl" />;
  if (!course) return <Text mt="xl">Course not found.</Text>;

  return (
    <Box>
      <Title order={2} mb="xs">
        {course.title}
      </Title>
      <Text c="dimmed" mb="md">
        {course.description}
      </Text>

      <Group justify="space-between" mb="xs">
        <Divider my="sm" label="Lessons" labelPosition="left" />
        <Button
          size="xs"
          variant="light"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Hide Form" : "Add Lesson"}
        </Button>
      </Group>

      {showAddForm && (
        <Paper withBorder p="md" mb="md">
          <AddLessonForm
            courseId={course.id}
            onSuccess={() => {
              setShowAddForm(false);
              fetchCourse();
            }}
          />
        </Paper>
      )}

      {selectedLesson ? (
        <>
          <Group justify="space-between" mt="md" mb="xs">
            <Title order={4}>{selectedLesson.title}</Title>
            <Button
              size="xs"
              variant="light"
              onClick={() => setSelectedLesson(null)}
            >
              ⬅ Back to Lessons
            </Button>
          </Group>

          <LessonQuizPanel lessonId={selectedLesson.id} />
        </>
      ) : (
        <Stack>
          {course.lessons
            ?.sort((a, b) => a.order - b.order)
            .map((lesson) => (
              <LessonListItem
                key={lesson.id}
                lesson={lesson}
                onEdit={() => setLessonToEdit(lesson)}
                onDelete={() => setLessonToDelete(lesson)}
                onSelect={() => setSelectedLesson(lesson)}
              />
            ))}
        </Stack>
      )}

      <EditLessonModal
        lesson={lessonToEdit}
        onClose={() => setLessonToEdit(null)}
        onSaved={fetchCourse}
      />

      <DeleteLessonConfirm
        lesson={lessonToDelete}
        onClose={() => setLessonToDelete(null)}
        onDeleted={fetchCourse}
      />
    </Box>
  );
}
