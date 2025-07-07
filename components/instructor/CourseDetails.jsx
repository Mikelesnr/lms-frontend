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

import api from "@/lib/api";

import LessonListItem from "@/components/lesson/LessonListItem";
import EditLessonModal from "@/components/lesson/EditLessonModal";
import DeleteLessonConfirm from "@/components/lesson/DeleteLessonConfirm";
import AddLessonForm from "@/components/lesson/AddLessonForm";

import LessonQuizPanel from "@/components/quiz/LessonQuizPanel";
import AddQuizForm from "@/components/quiz/AddQuizForm";

export default function CourseDetails({ id }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonToEdit, setLessonToEdit] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonLoading, setLessonLoading] = useState(false);

  const fetchCourse = () => {
    setLoading(true);
    api
      .get(`/api/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Failed to load course:", err))
      .finally(() => setLoading(false));
  };

  const fetchFullLesson = async (lesson) => {
    setLessonLoading(true);
    try {
      const res = await api.get(`/api/lessons/2/quiz`);
      setSelectedLesson({ ...lesson, quiz: res.data });
    } catch (err) {
      console.error("Failed to fetch quiz for lesson:", err);
      setSelectedLesson({ ...lesson, quiz: null });
    } finally {
      setLessonLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

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

          {lessonLoading ? (
            <Loader mt="md" />
          ) : selectedLesson.quiz ? (
            <LessonQuizPanel
              quiz={selectedLesson.quiz}
              onEdit={(quiz) => console.log("Edit quiz", quiz)}
              onDelete={(quiz) => console.log("Delete quiz", quiz)}
            />
          ) : (
            <AddQuizForm
              lessonId={selectedLesson.id}
              onCreated={() => {
                setSelectedLesson(null);
                fetchCourse();
              }}
            />
          )}
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
                onSelect={() => fetchFullLesson(lesson)}
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
