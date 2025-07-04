"use client";

import { useEffect, useState } from "react";
import { Table, Text, Loader, Button, Box } from "@mantine/core";
import api from "@/lib/api";

import AddCourseForm from "./AddCourseForm";
import EditCourseModal from "./EditCourseModal";
import CourseDetails from "./CourseDetails";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const fetchCourses = () => {
    setLoading(true);
    api
      .get("/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Failed to load courses", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleBack = () => setSelectedCourseId(null);

  const handleEdit = (course) => {
    setEditingCourse(course);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.get("/sanctum/csrf-cookie"); // Ensure CSRF cookie is set
      await api.delete(`/api/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  if (loading) return <Loader mt="md" />;
  if (!courses.length) return <Text>No courses found.</Text>;

  if (selectedCourseId) {
    return (
      <Box>
        <Button variant="subtle" size="xs" mb="sm" onClick={handleBack}>
          ← Back to courses
        </Button>
        <CourseDetails id={selectedCourseId} />
      </Box>
    );
  }

  return (
    <Box>
      <AddCourseForm onSuccess={fetchCourses} />

      <EditCourseModal
        course={editingCourse}
        onClose={() => setEditingCourse(null)}
        onSaved={fetchCourses}
      />

      <Table striped withTableBorder highlightOnHover>
        <thead>
          <tr>
            <th>Course Title</th>
            <th>Description</th>
            <th style={{ textAlign: "center", padding: 10 }}>Details</th>
            <th style={{ textAlign: "center", padding: 10 }}>Edit</th>
            <th style={{ textAlign: "center", padding: 10 }}>Delete</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td style={{ padding: 10 }}>{course.title}</td>
              <td style={{ padding: 10 }}>{course.description}</td>
              <td style={{ textAlign: "center" }}>
                <Button
                  size="xs"
                  variant="light"
                  style={{ margin: 10 }}
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  View Details
                </Button>
              </td>
              <td style={{ textAlign: "center" }}>
                <Button
                  size="xs"
                  variant="light"
                  style={{ margin: 10 }}
                  onClick={() => handleEdit(course)}
                >
                  Edit
                </Button>
              </td>
              <td style={{ textAlign: "center" }}>
                <Button
                  size="xs"
                  color="red"
                  variant="light"
                  style={{ margin: 10 }}
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}
