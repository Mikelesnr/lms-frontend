"use client";

import { useEffect, useState } from "react";
import { Table, Text, Loader, Button, Box } from "@mantine/core";
import useSanctumRequest from "@/lib/hooks/useSanctumRequest";

import AddCourseForm from "./AddCourseForm";
import EditCourseModal from "./EditCourseModal";
import CourseDetails from "./CourseDetails";
import DeleteCourseConfirm from "./DeleteCourseConfirm";

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const { sanctumGet } = useSanctumRequest();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await sanctumGet("/api/courses");
      setCourses(res.data ?? []);
    } catch (err) {
      console.error("Failed to load courses", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [sanctumGet]);

  const handleBack = () => setSelectedCourseId(null);
  const handleEdit = (course) => setEditingCourse(course);
  const handleDeleteModal = (course) => setCourseToDelete(course);

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

      <DeleteCourseConfirm
        course={courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onDeleted={fetchCourses}
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
                  onClick={() => handleDeleteModal(course)}
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
